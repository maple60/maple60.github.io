# Using OpenAlex from Python

python

openalex

api

A draft note on calling the OpenAlex API from Python and retrieving paper metadata.

Published

2026-06-01

Modified

2026-06-04

> **NOTE:**
>
> Original Japanese version: [OpenAlexをPythonから使ってみる](../../../posts/2026-06-01-openalex-python/index.llms.md)

## Introduction

This article organizes the basic steps for using [OpenAlex](https://openalex.org/) from Python to retrieve academic metadata such as papers and authors.

OpenAlex is a database of scholarly information covering papers, authors, journals, institutions, topics, and related entities. The base URL for the API is `https://api.openalex.org`, and endpoints such as `/works`, `/authors`, `/sources`, and `/institutions` are available.

This article starts with the `/works` endpoint and covers keyword search, filtering, and converting the results into a table.

## Runtime Environment

First, check that Python can run inside this `.qmd` file. This chunk does not access the API. It only confirms that Python, `requests`, and `pandas`, which are needed when rendering the article, are available.

``` python
import platform

import pandas as pd
import requests

pd.DataFrame(
    {
        "component": ["python", "requests", "pandas"],
        "version": [
            platform.python_version(),
            requests.__version__,
            pd.__version__,
        ],
    }
)
```

|     | component | version |
|-----|-----------|---------|
| 0   | python    | 3.12.13 |
| 1   | requests  | 2.34.2  |
| 2   | pandas    | 3.0.3   |

## Preparing an API Key

When using the OpenAlex API, it is useful to store the API key as an environment variable so that the key does not have to be written in the article body or code.

> **NOTE:**
>
> The OpenAlex API Reference describes passing `api_key` as a query parameter. When running the site through GitHub Actions, register `OPENALEX_API_KEY` as a repository secret and pass it as an environment variable in the workflow.

``` bash
export OPENALEX_API_KEY="your-api-key"
```

In Windows PowerShell, set it as follows.

``` powershell
$env:OPENALEX_API_KEY = "your-api-key"
```

## Searching for Papers with the Works API

The next code block is an example of sending a keyword search to the `/works` endpoint. Because it requires an API key, the draft keeps this chunk at `eval: false`. When running it as part of the article, set the API key first and then change the chunk to `eval: true`.

``` python
import os

import pandas as pd
import requests

api_key = os.environ["OPENALEX_API_KEY"]

params = {
    "api_key": api_key,
    "search": "species distribution model",
    "filter": "publication_year:2024,type:article,open_access.is_oa:true",
    "sort": "cited_by_count:desc",
    "per_page": 5,
    "select": "id,display_name,publication_year,cited_by_count,doi",
}

response = requests.get(
    "https://api.openalex.org/works",
    params=params,
    timeout=30,
)
response.raise_for_status()

works = response.json()["results"]

pd.DataFrame(
    [
        {
            "title": work["display_name"],
            "year": work["publication_year"],
            "citations": work["cited_by_count"],
            "doi": work.get("doi"),
            "openalex_id": work["id"],
        }
        for work in works
    ]
)
```

## How to Review Retrieved Results

The retrieved results are easier to turn into an article when you check them from the following perspectives.

- `display_name`: Use it as the paper title.
- `publication_year`: Use it for filtering or aggregating by year.
- `cited_by_count`: Sort by citation count to find frequently cited papers.
- `doi`: Use it to link to the original paper when a DOI is available.
- `id`: Use it as a persistent identifier on OpenAlex.

## What to Try Next

This first draft only covers the Works API. When expanding the article, the following additions would fit naturally.

- Filter by a specific author ID or institution ID.
- Use `group_by` to summarize publication years or open access status.
- Retrieve OpenAlex records from DOIs.
- Save the retrieved literature list as a CSV file.

## References

- [OpenAlex API Overview](https://developers.openalex.org/api-reference/introduction)
- [OpenAlex Works API](https://developers.openalex.org/api-reference/works/list-works)
- [Using Python - Quarto](https://quarto.org/docs/computations/python.html)
