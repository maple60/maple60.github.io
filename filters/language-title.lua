-- Both languages share one QMD; pick translated page metadata at build time.
local is_en = os.getenv("QUARTO_PROFILE") == "en"

function Meta(meta)
  if is_en then
    for _, field in ipairs({"title", "description"}) do
      if meta[field .. "-en"] then
        meta[field] = meta[field .. "-en"]
      end
    end
  end
  return meta
end

-- Link to the same page in the other language (output trees mirror each other).
function Pandoc(doc)
  local input = quarto.doc.input_file:gsub("\\", "/")
  local rel = input:match("(posts/.+)/[^/]+$")
  if not rel then return doc end
  local _, depth = rel:gsub("/", "")
  depth = depth + 1
  local href, text
  if is_en then
    href = string.rep("../", depth + 1) .. rel .. "/"
    text = "日本語版"
  else
    href = string.rep("../", depth) .. "en/" .. rel .. "/"
    text = "English version"
  end
  local link = pandoc.Link(text, href)
  table.insert(doc.blocks, 1, pandoc.Div({pandoc.Para({link})}, pandoc.Attr("", {"callout-note"})))
  return doc
end
