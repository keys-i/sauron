const branch = (process.argv[2] ?? process.env.GITHUB_HEAD_REF ?? "").replace(
  /^refs\/heads\//,
  "",
);
const automated =
  /^dependabot\/(npm_and_yarn|cargo|github_actions)\//.test(branch) ||
  /^release(?:-plz-)?\d{4}-\d{2}-\d{2}/.test(branch);

if (branch && !automated && !/^[a-z][a-z0-9]*$/.test(branch)) {
  throw new Error(`branch "${branch}" must be one lowercase word`);
}
