import ky from 'ky'

const limit = '6'

export type BookSearchItem = Awaited<
  ReturnType<typeof getBooks>
>['docs'][number]

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getBooks({ search }: { search: string }) {
  const params = new URLSearchParams({
    q: search,
    limit,
    has_fulltext: 'true',
    fields: 'key,title,author_name,author_key,first_publish_year,cover_i',
  })
  const response = await ky
    .get(`https://openlibrary.org/search.json?${params.toString()}`)
    .json<{
      numFound: number
      start: number
      offset: number
      docs: Array<{
        key: string
        title: string
        author_name: [string, ...Array<string>]
        author_key: [string, ...Array<string>]
        coverId: string
        first_publish_year: number
        cover_i: number
      }>
    }>()

  await sleep(500)

  return {
    ...response,
    docs: response.docs.map((doc) => ({
      id: doc.key,
      coverId: doc.cover_i,
      authorName: doc.author_name[0],
      authorId: `/authors/${doc.author_key[0]}`,
      title: doc.title,
      publishYear: doc.first_publish_year,
    })),
  }
}

export type BookDetailItem = Awaited<ReturnType<typeof getBook>>

export async function getBook(id: string) {
  const response = await ky.get(`https://openlibrary.org${id}.json`).json<{
    title: string
    description?: string | { value: string }
    covers: Array<number>
    links?: Array<{ title: string; url: string }>
    authors: [{ author: { key: string } }]
  }>()

  await sleep(250)

  const description =
    typeof response.description === 'string'
      ? response.description
      : response.description?.value

  return {
    title: response.title,
    ...(description
      ? { description: description.replaceAll(String.raw`\n`, '\n') }
      : undefined),
    covers: response.covers.filter((cover) => cover > 0),
    ...(response.links ? { links: response.links } : undefined),
    authorId: response.authors[0].author.key,
  }
}

export type Author = Awaited<ReturnType<typeof getAuthor>>

export async function getAuthor(id: string) {
  const response = await ky.get(`https://openlibrary.org${id}.json`).json<{
    personal_name: string
    links?: Array<{ url: string }>
  }>()

  await sleep(1000)

  return {
    name: response.personal_name,
    link: response.links?.map((link) => ({
      url: link.url,
    }))[0]?.url,
  }
}
