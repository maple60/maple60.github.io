# Things I Got Stuck on with BASIC Authentication

misc

Notes on small pitfalls when using BASIC authentication.

Published

2024-06-18

Modified

2024-06-18

> **NOTE:**
>
> Original Japanese version: [BASIIC認証でつまったこと](../../../posts/2024-06-18-basic_authentification/index.llms.md)

This is a short note from when I used BASIC authentication.

I thought I had created appropriate `.htaccess` and `.htpasswd` files, but the server returned a 500 error, or Internal Server Error.

The causes were the following:

- `AuthUserFile` had been written as `AuthUserfile`; the `f` was lowercase.
- The quotation marks around the `AuthName` string were smart quotes, `“`, instead of straight quotes, `"`.

Both are small details, but they are easy to miss.

This was a side effect of copying and pasting from a reference site. For code, it may be better to type it manually at first.

There are many other traps as well, so extra care is needed, especially before getting used to the workflow.
