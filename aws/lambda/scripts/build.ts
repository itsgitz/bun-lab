export function buildLocalTag(imageName: string, imageTag: string): string {
  return `${imageName}:${imageTag}`;
}

export function buildRemoteTag(ecrUri: string, imageTag: string): string {
  return `${ecrUri}:${imageTag}`;
}

async function main() {
  console.log("\n🚀 AWS Lambda Build & Deploy\n");

  const { input } = await import("@inquirer/prompts");

  let imageName: string;
  let imageTag: string;
  let ecrRepo: string;
  let region: string;
  let awsProfile: string;

  try {
    imageName = await input({
      message: "Docker image name:",
      default: "bun-lab-lambda",
    });
    imageTag = await input({ message: "Image tag:", default: "latest" });
    ecrRepo = await input({
      message: "ECR repository name:",
      default: "bun-lab-lambda",
    });
    region = await input({ message: "AWS region:", default: "us-east-1" });
    awsProfile = await input({ message: "AWS profile:", default: "default" });
  } catch {
    console.log("\nBuild cancelled.");
    process.exit(0);
  }

  if (!imageName || !imageTag || !ecrRepo || !region || !awsProfile) {
    console.error("All fields are required.");
    process.exit(1);
  }

  const localTag = buildLocalTag(imageName, imageTag);

  try {
    console.log(`\n▶ Building Docker image: ${localTag}`);
    await Bun.$`docker build --provenance=false --platform linux/amd64 -t ${localTag} .`;

    console.log(`\n▶ Creating ECR repository: ${ecrRepo}`);
    let ecrUri: string;
    try {
      const result =
        await Bun.$`aws ecr create-repository --repository-name ${ecrRepo} --region ${region} --query repository.repositoryUri --output text --profile ${awsProfile}`;
      ecrUri = result.stdout.toString().trim();
    } catch {
      // Repository already exists — fetch the URI instead
      const result =
        await Bun.$`aws ecr describe-repositories --repository-names ${ecrRepo} --region ${region} --query repositories[0].repositoryUri --output text --profile ${awsProfile}`;
      ecrUri = result.stdout.toString().trim();
    }

    if (!ecrUri) {
      console.error("Failed to obtain ECR URI.");
      process.exit(1);
    }
    console.log(`ECR URI: ${ecrUri}`);

    console.log(`\n▶ Authenticating with ECR`);
    await Bun.$`aws ecr get-login-password --region ${region} --profile ${awsProfile} | docker login --username AWS --password-stdin ${ecrUri}`;

    const remoteTag = buildRemoteTag(ecrUri, imageTag);

    console.log(`\n▶ Tagging image: ${localTag} → ${remoteTag}`);
    await Bun.$`docker tag ${localTag} ${remoteTag}`;

    console.log(`\n▶ Pushing image: ${remoteTag}`);
    await Bun.$`docker push ${remoteTag}`;

    console.log("\n✅ Deploy complete!");
  } catch (err) {
    console.error(
      `\nBuild failed: ${err instanceof Error ? err.message : err}`,
    );
    process.exit(1);
  }
}

if (import.meta.main) {
  main().catch((err) => {
    console.error(
      "\nUnexpected error:",
      err instanceof Error ? err.message : err,
    );
    process.exit(1);
  });
}
