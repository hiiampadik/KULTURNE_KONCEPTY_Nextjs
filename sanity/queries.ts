import {groq} from 'next-sanity'

export const footerQuery = groq`*[_type == "footer"][0]{
  "contacts": contacts[language == $locale][0].value,
  "info": info[language == $locale][0].value,
  items[] {
    _key,
    title,
    "url": document.asset->url,
    "originalFilename": document.asset->originalFilename,
    "size": document.asset->size,
    "extension": document.asset->extension,
  },
}`

export const homepageQuery = groq`*[_type == "homepage"][0]{
  "aboutUs": aboutUs[language == $locale][0].value,
  stickers[] {
    ...,
    asset->
  },
  "fields": fields[]->{
    _id,
    "title": title[language == $locale][0].value,
    "body": body[language == $locale][0].value,
    icon {
      ...,
      asset->
    }
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
    "fields": fields[]->{ _id, "title": title[language == $locale][0].value }
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
    "fields": fields[]->{ _id, "title": title[language == $locale][0].value }
  }
}`
