# Managing Analysis Projects with Quarto

quarto

A summary of managing analysis projects with Quarto’s book format.

Published

2026-02-11

Modified

2026-02-25

> **NOTE:**
>
> Original Japanese version: [Quartoを用いた解析プロジェクト管理について](../../../posts/2026-02-11-quarto-project-management/index.llms.md)

> **WARNING:**
>
> This article is published while still in progress. I will update it when I have time.

[Quarto](https://quarto.org/) is an open-source tool for creating documents and websites using languages such as R and Python. With Quarto, it is easy to create HTML documents that can be read in a browser. I wondered whether this could be used to manage analysis projects that have a fixed sequence of steps, so I am leaving this note.

> **NOTE:**
>
> - This article assumes that **R code is executed in qmd files**.
> - I will touch on the basic usage of Quarto as much as possible, but for details please see the [official documentation](https://quarto.org/).

## Problems in Analysis Projects

In many analysis projects, several steps are executed in order. Examples include data preprocessing, analysis, visualization, and report creation.

It is common to manage these steps by separating scripts for each process. However, as the number of scripts increases, it becomes harder to know the correct execution order.

Until now, I have managed the order by numbering file names, such as `00_data_preprocessing.R`, `01_analysis.R`, and `02_visualization.R`. However, as the number of files increases, managing the numbers becomes cumbersome and mistakes become more likely. For example, when a new analysis is added and the order changes, the numbers in all file names need to be changed.

Also, even within a single qmd file, code cells can be executed individually. When running the file from top to bottom later, errors can occur because required variables do not exist. For example, if an analysis cell is executed without first running the preprocessing cell, the required data does not exist and an error occurs.

To solve these problems, I considered managing analysis projects with Quarto’s book format. I am still trying this approach, but I summarize the method below.

## What Is Quarto’s Book Format?

Quarto’s book format is a feature that can combine multiple qmd files and output them as one document. For example, the well-known R introduction [R for Data Science (2e)](https://r4ds.hadley.nz/) is created with Quarto’s book format.

Recently, many R-related books have also been created in Quarto’s book format. If you look at [R for Data Science (2e)](https://r4ds.hadley.nz/), you can see that pages are arranged in order like an actual book, with sections throughout.

I thought that analysis code that needs to be executed in order might be manageable in the same way with the book format.

## Example Structure of an Existing Analysis Project

Here, consider a realistic project where the analysis is divided into steps such as data preprocessing, analysis, and visualization. For example, suppose an analysis folder is managed as follows.

``` plaintext
notebooks/
├── 01_data_preprocessing_AA.qmd
├── 02_data_preprocessing_BB.qmd
├── 03_analysis_CC.qmd
├── 04_analysis_DD.qmd
├── 05_visualization_EE.qmd
└── 06_visualization_FF.qmd
```

In this structure, qmd files are separated by step. However, suppose you later want to add a new preprocessing step before `02_data_preprocessing_BB`. In that case, all file name numbers need to be changed, which is very tedious.

## Creating a Quarto Book

To solve this problem, manage the analysis project with Quarto’s book format.

Open the command palette with `Ctrl+Shift+P` and select “Quarto: Create New Book Project.” Enter the project name and specify the folder where it should be saved.
