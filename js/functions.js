const getRandomNumber  = (from = false, to = false, floatsNum = 0) => {
  /* v2.1 */
  /* if all vars are numbers */
  if (typeof from !== 'number' || typeof to !== 'number') {
    return NaN;
  }
  if (floatsNum && typeof floatsNum !== 'number') {
    return NaN;
  }
  /* convert a float to an int and back */
  const getXtoPow = (y) => 10 ** y;
  const getFloatsNumber = (s) => {
    /* to avoid +e format +100,
    +100 doesn't get (e.g.) 0.59 to 0.58999999999999, +1 does */
    s = (s + 100).toString();
    /* gets a number of digits after the period (23.34455 - 5) */
    return s.indexOf('.') > 0 ? s.length - s.indexOf('.') - 1 : 0;
  };
  /* normalize the order of the vars */
  from = Math.abs(from);
  to = Math.abs(to);
  if (from === to) {
    return floatsNum ?
      Math.round(from * getXtoPow(floatsNum)) / getXtoPow(from) :
      from;
  }
  if (from > to) {
    [from, to] = [to, from];
  }
  /* result = Round(from + randomNumberFromDifference(from-to)Range) */
  /* get range */
  let result = to - from;
  /* range to int (e.g. 32.00231 * 100000) */
  result = floatsNum ? result * getXtoPow(getFloatsNumber(from)) : result;
  /* random number from range (0-range) */
  result = Math.floor(Math.random() * (result + 1));
  /* random number back to float (e.g. 100231 / 100000) */
  result = floatsNum ? result / getXtoPow(getFloatsNumber(from)) : result;
  /* the sum: */
  result = from + result;
  /* round to floatsNum, e.g.: round(12.099799 * 100) = 1210 / 100 = 12.10 */
  return floatsNum ?
    Math.round(result * getXtoPow(floatsNum)) / getXtoPow(floatsNum) :
    Math.floor(result);
};
export {getRandomNumber};

class RandomTextGen {
  /* v2.2 */
  /* call with (* - required)
    Object.assign(objName.params, {
      wordsLenFr:        *number
      wordsLenTo:        *number
      wordsNumFr:        *number
      wordsNumTo:        *number
      sentencesNumFr:    *number
      sentencesNumTo:    *number
      sentenceEnd:       string.length === 1, def - '.'
    })
  */
  constructor() {
    this.consts = {
      ABC:                      {
        ru:   'аабвгдееёжзиийклмноопрстууфхцчшщъыьэюя',
        en:   'aabcdeefghiijklmnoopqrstuuvwxyyz',
        cur:  [],
        def() {
          return this.consts.ABC.en;
        },
        set() {
          return this.consts.ABC[navigator.language] || this.consts.ABC.def();
        },
        shuff() {
          this.consts.ABC.cur.sort(() => Math.random() - 0.5);
        },
      },
      COMMA:                    {
        y: ',',
        n: '',
      },
      WORDS_LENGTH_DEF:         5,
      SENTENCE_WORDS_NUM_DEF:   5,
      SENTENCE_ENDS:            ['.', '?', '!'],
      SENTENCE_ENDS_DOTS_FREC:  8,
      SENTENCE_COMMAS_FREC:     {
        x: 20,
        y: 2,
      },
      SENTENCES_NUM_DEF:        3,
      PARAMS_DEF:               {
        wordsLenFr: '',
        wordsLenTo: '',
        wordsNumFr: '',
        wordsNumTo: '',
        sentencesNumFr: '',
        sentencesNumTo: '',
        sentenceEnd: '.',
      },
      PARAMS_ERORR:             'RandomTextGen Params error.',
    };
    this.params = Object.assign({}, this.consts.PARAMS_DEF);
    this.checkParams = this.checkParams.bind(this);
    this.consts.ABC.def = this.consts.ABC.def.bind(this);
    this.consts.ABC.set = this.consts.ABC.set.bind(this);
    this.consts.ABC.shuff = this.consts.ABC.shuff.bind(this);
    this.getWord = this.getWord.bind(this);
    this.getSentence = this.getSentence.bind(this);
    this.getText = this.getText.bind(this);
  }

  checkParams() {
    const params = Object.assign({}, this.params);
    /* sentenceEnd - string 1 symbol or '' */
    if (typeof params.sentenceEnd === 'string' && params.sentenceEnd.length === 1 || params.sentenceEnd === '') {
      params.sentenceEnd = 1;
    }
    /* the rest are numbers > 0 */
    return Object.values(params).filter((el) => typeof el !== 'number' || !el).length === 0;
  }

  getWord() {
    this.consts.ABC.shuff();
    const wordLen = getRandomNumber(this.params.wordsLenFr, this.params.wordsLenTo) || this.consts.WORDS_LENGTH_DEF;
    const word = this.consts.ABC.cur.slice(0, wordLen);
    return word.length && word.join('') || this.getWord();
  }

  getSentence() {
    const sentenceEnd = this.params.sentenceEnd !== '.' && [this.params.sentenceEnd] || this.consts.SENTENCE_ENDS;
    const wordsNum = getRandomNumber(this.params.wordsNumFr, this.params.wordsNumTo) || this.consts.SENTENCE_WORDS_NUM_DEF;
    const sentence = Array.from({ length: wordsNum }, this.getWord);
    /* cptlz the first word of a sentence */
    sentence[0] = sentence[0].slice(0, 1).toUpperCase() + sentence[0].slice(1);
    /* insert commas */
    sentence.forEach((el, id) => {
      sentence[id] +=
        id !== sentence.length - 1 &&
          getRandomNumber(0, this.consts.SENTENCE_COMMAS_FREC.x) < this.consts.SENTENCE_COMMAS_FREC.y &&
            this.consts.COMMA.y ||
            this.consts.COMMA.n;
    });
    /* add . ! ? or '' at the end of a sentence */
    return `${sentence.join(' ')}${sentenceEnd[getRandomNumber(0, this.consts.SENTENCE_ENDS_DOTS_FREC)] || sentenceEnd[0]}`;
  }

  getText() {
    /* if all params are set */
    if (!this.checkParams()) {
      /*  console.  error   (this.  consts  . PARAMS_ERORR)  ; */
      return '';
    }
    /* set abc */
    if (!this.consts.ABC.cur.length) {
      this.consts.ABC.cur = [...this.consts.ABC.set()];
    }
    const sentenceNum = getRandomNumber(this.params.sentencesNumFr, this.params.sentencesNumTo) || this.consts.SENTENCES_NUM_DEF;
    const text = Array.from({ length: sentenceNum }, this.getSentence);
    /* reset params */
    this.params = Object.assign({}, this.consts.PARAMS_DEF);
    return text.join(' ');
  }
}
const getRandomText = (params = false) => {
  if (!params) {
    return '';
  }
  const randomText = new RandomTextGen();
  Object.assign(randomText.params, params);
  return randomText.getText();
};
export {getRandomText};
