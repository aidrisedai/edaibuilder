import { deployToGithubPages } from "@/lib/github/deploy";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { projectTitle, htmlContent } = await request.json();

    if (!projectTitle || !htmlContent) {
      return Response.json(
        { error: "Project title and HTML content are required" },
        { status: 400 }
      );
    }

    const githubToken = process.env.GITHUB_TOKEN;
    const githubOrg = process.env.GITHUB_ORG;

    if (!githubToken || !githubOrg) {
      return Response.json(
        { error: "GitHub configuration missing" },
        { status: 500 }
      );
    }

    const slug = slugify(projectTitle);
    const result = await deployToGithubPages(
      slug,
      htmlContent,
      githubToken,
      githubOrg
    );

    return Response.json({
      success: true,
      repoUrl: result.repoUrl,
      pagesUrl: result.pagesUrl,
    });
  } catch (error) {
    console.error("Deploy API error:", error);
    return Response.json(
      { error: `Deployment failed: ${error}` },
      { status: 500 }
    );
  }
}
