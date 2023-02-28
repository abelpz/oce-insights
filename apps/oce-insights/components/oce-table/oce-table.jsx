import styled from '@emotion/styled';
import { fetchRepos } from 'apps/oce-insights/core/fetchGithub';
import { defaultMap } from 'apps/oce-insights/core/oceParser';
import MUIDataTable from 'mui-datatables';
import { useEffect, useState, useMemo } from 'react';
import { Chip, IconButton } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export function OceTable({ title = 'OCE', options = {} }) {
  const [repos, setRepos] = useState([{}]);

  const orgReposMap = (repo) => ({
    ...Object.keys(repo).reduce((newRepo, column) => {
      if (
        repo[column]?.toString() === '[object Object]' ||
        typeof repo[column] === 'boolean'
      ) {
        newRepo[column] = JSON.stringify(repo[column]);
        return newRepo;
      }
      newRepo[column] = repo[column];
      return newRepo;
    }, {}),
    owner: repo.owner.login,
    html_url: (
      <IconButton
        href={repo.html_url}
        target={'_blank'}
        title={`${repo.owner.login}/${repo.name}`}
        aria-label="open in github"
      >
        <OpenInNewIcon />
      </IconButton>
    ),
  });

  const defaultColumns = useMemo(
    () => [
      {
        name: 'owner',
        label: 'Owner',
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: 'name',
        label: 'Name',
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: 'description',
        label: 'Description',
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: 'topics',
        label: 'Topics',
        options: {
          filter: true,
          filterType: 'multiselect',
          sort: false,
          customBodyRenderLite: (dataIndex) => {
            let value = repos[dataIndex].topics;
            console.log({ repos, dataIndex, item: repos[dataIndex] });
            console.log({ value });
            return (
              value?.map((val, key) => {
                console.log(value);
                return <Chip label={val} key={key} />;
              }) || []
            );
          },
        },
      },
      {
        name: 'html_url',
        label: 'Repo Url',
        options: {
          filter: false,
          sort: false,
        },
      },
    ],
    [repos]
  );

  const extraColumns = useMemo(
    () =>
      Object.keys(repos[0]).reduce((extraColumns, column) => {
        if (defaultColumns.some((c) => c.name === column)) return extraColumns;
        extraColumns.push({ name: column, options: { display: false } });
        return extraColumns;
      }, []),
    [repos, defaultColumns]
  );

  const columns = useMemo(() => {
    const columns = [...defaultColumns, ...extraColumns];
    console.log({ columns });
    return columns;
  }, [defaultColumns, extraColumns]);

  useEffect(async () => {
    const fetchedRepos = (await fetchRepos('unfoldingWord'))?.map(orgReposMap);
    console.log({ fetchedRepos });
    setRepos(fetchedRepos);
  }, []);

  return (
    <MUIDataTable
      title={title}
      data={repos}
      columns={columns}
      options={options}
    />
  );
}

export default OceTable;
