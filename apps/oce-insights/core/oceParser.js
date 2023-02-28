import { fetchReadme } from './fetchGithub';

function validateRepos(repos) {
  let data = [];
  validations.forEach(async (validation) => {
    const filtered = validation.filter
      ? repos.filter(validation.filter)
      : repos;
    data.push(await Promise.all(filtered.map(validation.map || defaultMap)));
  });
}

export const defaultMap = ({
  name,
  description,
  html_url,
  owner: { login },
  topics,
}) => ({
  owner: login,
  name,
  description,
  topics,
  html_url: `<a href="${html_url}" target="_blank">gh: ${name}</a>`,
});

const generateTitlePatterns = (titles) => {
  return titles.map(
    (title) => ({
      title,
      pattern: new RegExp(
        `(^##+? ${title})|(<h\\d.*?>${title}.*?</h\\d>)`,
        'gim'
      ),
    }),
    []
  );
};

const readmeSections = [
  'About',
  'Built With',
  'Getting Started',
  'Prerequisites',
  'Installation',
  'Usage',
  'Roadmap',
  'Contributing',
  'License',
  'Contact',
  'Acknowledgments',
];

const readmePatterns = [
  {
    title: 'title',
    pattern: /(^# .+)|(<h1.*?>.+?<\/h1>)/gm,
  },
  ...generateTitlePatterns(readmeSections),
];

const validations = [
  {
    title: 'Not containing OCE topics',
    description:
      "List repos that do not contain the topics 'scripture-open-components' or 'scripture-open-apps'",
    filter: (repo) =>
      !repo.topics.some(
        (topic) =>
          topic === 'scripture-open-components' ||
          topic === 'scripture-open-apps'
      ),
  },
  {
    title: 'Containing topic scripture-open-apps',
    description: "List repos that contain the topic 'scripture-open-apps'",

    filter: (repo) =>
      repo.topics.some((topic) => topic === 'scripture-open-apps'),
  },
  {
    title: 'Containing topic scripture-open-components',
    description:
      "List repos that contain the topic 'scripture-open-components'",
    filter: (repo) =>
      repo.topics.some((topic) => topic === 'scripture-open-components'),
  },
  {
    title: 'Readme validations',
    description:
      "Evaluates how Readme files for each repo conforms to the template: 'https://github.com/unfoldingWord/blank-project-template'",
    map: async (repo) => {
      const _repo = await validateReadme(repo, readmePatterns);
      return {
        owner: _repo.owner.login,
        name: _repo.name,
        description: _repo.description,
        readme_length: _repo.readme_length,
        missing_sections: _repo.missing_sections,
        html_url: `<a href="${_repo.html_url}" target="_blank">gh: ${_repo.name}</a>`,
      };
    },
  },
];

async function validateReadme(repo, patterns) {
  const readme = await fetchReadme(repo);
  const missing = [];
  let readme_length = 0;
  if (readme) {
    patterns.forEach((readmeValidation) => {
      if (!readmeValidation.pattern.test(readme)) {
        missing.push(readmeValidation.title);
      }
    });
    readme_length = readme.length;
  } else {
    missing.push('missing README.md');
  }

  const newRepo = {
    ...repo,
    readme_length,
    missing_sections: missing.join(', '),
  };
  return newRepo;
}
