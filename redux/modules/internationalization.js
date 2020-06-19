// ///////////////////////////////////////
// Internationalization module
// (will) contain(s) multiple variables related to internationalization.
// Currently only has language.
import { AsyncStorage } from "react-native";
import { STORE_INIT } from "./common";

const STORE_LANGUAGE_KEY = "settings.lang";

import en from "../../assets/internationalization/en.json";
import mk from "../../assets/internationalization/mk.json";
import ms from "../../assets/internationalization/ms.json";
import es from "../../assets/internationalization/es.json";
import fr from "../../assets/internationalization/fr.json";
import de from "../../assets/internationalization/de.json";
import sr from "../../assets/internationalization/sr.json";
import ru from "../../assets/internationalization/ru.json";
import tl from "../../assets/internationalization/tl.json";
import uk from "../../assets/internationalization/uk.json";

const languages = {
  en: en,
  de: de,
  es: es,
  fr: fr,
  mk: mk,
  ms: ms,
  ru: ru,
  sr: sr,
  tl: tl,
  uk: uk,
};

export const availableLanguages = [
  { lang_short: "en", lang_full: "English" },
  { lang_short: "mk", lang_full: "Македонски" },
  { lang_short: "es", lang_full: "Espagnol" },
  { lang_short: "fr", lang_full: "Français" },
  { lang_short: "de", lang_full: "Deutsch" },
  { lang_short: "ms", lang_full: "Bahasa Melayu" },
  { lang_short: "sr", lang_full: "Српски" },
  { lang_short: "ru", lang_full: "Русский" },
  { lang_short: "tl", lang_full: "Tagalog" },
  { lang_short: "uk", lang_full: "Українська" },
];

// ///////////////////////////////////////
// Actions

const CHANGE_LANGUAGE = "sikoba/internationalization/CHANGE_LANGUAGE";

// ///////////////////////////////////////
// Reducer

const initialState = { currentLanguage: "en" };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LANGUAGE: {
      const lang = action.payload.language;

      AsyncStorage.setItem(STORE_LANGUAGE_KEY, lang);
      return {
        ...state,
        currentLanguage: lang,
      };
    }
    case STORE_INIT:
      return initialState;
    default:
      return state;
  }
}

// ///////////////////////////////////////
// Selectors

const getLanguage = () => (dispatch, getState) =>
  getState().internationalization.currentLanguage;

export const daysLiterals = (state) => {
  const keys = ["TODAY", "TOMORROW"];
  const lang = state.internationalization.currentLanguage;

  var result = {};

  keys.forEach(function(key) {
    result[key] = languages[lang][key];
  });

  return result;
};

// To be used from components
const getString = (key) => (dispatch, getState) => {
  const state = getState();

  return retrieveString(key, state);
};

// To be used from other redux modules
export const getStringRedux = (key, providedState) => {
  const state = providedState;

  return retrieveString(key, state);
};

const retrieveString = (key, state) => {
  if (
    languages[state.internationalization.currentLanguage].hasOwnProperty(key)
  ) {
    return languages[state.internationalization.currentLanguage][key];
  } else {
    // check default translation exists in english
    if (languages["en"].hasOwnProperty(key)) return languages["en"][key];
    else return "MISSING TRANSLATION KEY : " + key; // return warning if no translation found
  }
};

// ///////////////////////////////////////
// Action Creators
const changeLanguage = (language) => ({
  type: CHANGE_LANGUAGE,
  payload: { language },
});

// ///////////////////////////////////////
// pseudo-Action Creators

const setLanguage = (language) => async (dispatch, getState) => {
  dispatch(changeLanguage(language));
};

const loadLanguage = () => async (dispatch, getState) => {
  const lang = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
  if (lang) dispatch(changeLanguage(lang));
};

export const actions = {
  setLanguage,
  getString,
  getLanguage,
  loadLanguage,
};
