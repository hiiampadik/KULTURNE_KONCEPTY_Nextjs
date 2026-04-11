import {groq} from 'next-sanity'

export const homepageQuery = groq`*[_type == "homepage"][0]{
  "aboutUs": aboutUs[language == $locale][0].value,
  "fields": fields[]->{
    _id,
    "title": title[language == $locale][0].value,
    "body": body[language == $locale][0].value
  },
  "projects": projects[]->{
    _id,
    "title": title[language == $locale][0].value,
    date,
    cover,
    "subtitle": subtitle[language == $locale][0].value,
    "fields": fields[]->{
      "title": title[language == $locale][0].value
    }
  },
  "references": references[]->{
    _id,
    "title": title[language == $locale][0].value,
    date,
    cover,
    "description": description[language == $locale][0].value,
    "fields": fields[]->{
      "title": title[language == $locale][0].value
    }
  }
}`
