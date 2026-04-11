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
    active,
    "title": title[language == $locale][0].value,
    date,
    cover,
    "subtitle": subtitle[language == $locale][0].value,
    "description": description[language == $locale][0].value,
    "web": web[language == $locale][0].value,
    "location": location[language == $locale][0].value,
    gallery,
    "fields": fields[]->{
      "title": title[language == $locale][0].value
    }
  },
  "references": references[]->{
    _id,
    active,
    "title": title[language == $locale][0].value,
    date,
    cover,
    "subtitle": subtitle[language == $locale][0].value,
    "description": description[language == $locale][0].value,
    "web": web[language == $locale][0].value,
    "location": location[language == $locale][0].value,
    gallery,
    "fields": fields[]->{
      "title": title[language == $locale][0].value
    }
  }
}`
