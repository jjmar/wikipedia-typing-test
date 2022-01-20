import deburr from 'lodash.deburr'

export default async function getRandomWikipediaArticle() {
  const url = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exsentences=20&exintro=&explaintext=&generator=random&grnnamespace=0&origin=*'

  const response = await fetch(url)
  const body = await response.json()

  const articleId = Object.entries(body.query.pages)[0][0]
  const articleDetails = body.query.pages[articleId]

  return {
    id: articleId,
    title: articleDetails.title,
    words: deburr(articleDetails.extract).split(' ')
  }
}
