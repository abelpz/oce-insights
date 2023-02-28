export async function fetchReadme(repo) {
  const fileNames = ['README', 'Readme', 'readme'];
  let readme;
  for await (const fileName of fileNames) {
    readme = await fetch(
      `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/${repo.default_branch}/${fileName}.md`
    ).then((response) =>
      response.status === 200 ? response.text() : undefined
    );
    if (readme) break;
  }
  return readme;
}

export async function fetchRepos(org, page = 1, acc = []) {
  const data =
    (await fetch(`https://api.github.com/orgs/${org}/repos?page=${page}`).then(
      (data) => data.json()
    )) || [];
  console.log({ data, page, acc });
  if (!data.length || page > 10) return acc;
  return await fetchRepos(org, ++page, [...acc, ...data]);
}

async function fetchAllOceRepos(page = 1, acc = []) {
  const queryString = encodeURIComponent(
    'scripture-open-apps OR scripture-open-components in:topics'
  );
  const url = `https://api.github.com/search/repositories?q=${queryString}&page=${page}`;
  console.log({ url });
  const data = (await fetch(url).then((data) => data.json()))?.items || [];
  if (!data.length || page > 10) return acc;
  return await fetchAllOceRepos(++page, [...acc, ...data]);
}
