/**
 * @enum number
 */
export const State = {
  TopLevelContent: 1,
  AfterKeywordDeclaration: 2,
}

/**
 * @enum number
 */
export const TokenType = {
  Whitespace: 2,
  Punctuation: 3,
  CurlyOpen: 6,
  CurlyClose: 7,
  PropertyColon: 8,
  Variable: 10,
  None: 57,
  Unknown: 881,
  Numeric: 883,
  NewLine: 884,
  Comment: 885,
  Text: 887,
  FuntionName: 890,
  String: 891,
  KeywordImport: 892,
  Keyword: 123,
  KeywordControl: 124,
  KeywordReturn: 125,
  Type: 126,
}

export const TokenMap = {
  [TokenType.Whitespace]: 'Whitespace',
  [TokenType.Punctuation]: 'Punctuation',
  [TokenType.CurlyOpen]: 'Punctuation',
  [TokenType.CurlyClose]: 'Punctuation',
  [TokenType.PropertyColon]: 'Punctuation',
  [TokenType.Variable]: 'VariableName',
  [TokenType.None]: 'None',
  [TokenType.Unknown]: 'Unknown',
  [TokenType.Numeric]: 'Numeric',
  [TokenType.NewLine]: 'NewLine',
  [TokenType.Comment]: 'Comment',
  [TokenType.Text]: 'Text',
  [TokenType.FuntionName]: 'Function',
  [TokenType.String]: 'String',
  [TokenType.KeywordImport]: 'KeywordImport',
  [TokenType.Keyword]: 'Keyword',
  [TokenType.KeywordControl]: 'KeywordControl',
  [TokenType.KeywordReturn]: 'KeywordReturn',
  [TokenType.Type]: 'Type',
}

const RE_WHITESPACE = /^\s+/
const RE_CURLY_OPEN = /^\{/
const RE_CURLY_CLOSE = /^\}/
const RE_PROPERTY_NAME = /^[a-zA-Z\-\w]+/
const RE_COLON = /^:/
const RE_SEMICOLON = /^;/
const RE_COMMA = /^,/
const RE_ANYTHING = /^.+/s
const RE_NUMERIC = /^\-?(([0-9]+\.?[0-9]*)|(\.[0-9]+))/
const RE_BLOCK_COMMENT_START = /^\/\*/
const RE_BLOCK_COMMENT_END = /^\*\//
const RE_BLOCK_COMMENT_CONTENT = /^.+?(?=\*\/|$)/s
const RE_ROUND_OPEN = /^\(/
const RE_ROUND_CLOSE = /^\)/
const RE_PSEUDO_SELECTOR_CONTENT = /^[^\)]+/
const RE_SQUARE_OPEN = /^\[/
const RE_SQUARE_CLOSE = /^\]/
const RE_ATTRIBUTE_SELECTOR_CONTENT = /^[^\]]+/
const RE_QUERY = /^@[a-z\-]+/
const RE_STAR = /^\*/
const RE_QUERY_NAME = /^[a-zA-Z\w\-\d\_]+/
const RE_QUERY_CONTENT = /^[^\)]+/
const RE_COMBINATOR = /^[\+\>\~]/
const RE_FUNCTION = /^[a-zA-Z][a-zA-Z\-]+(?=\()/
const RE_VARIABLE_NAME = /^[a-zA-Z\w\-\_\d]+/
const RE_PERCENT = /^\%/
const RE_OPERATOR = /^[\-\/\*\+]/
const RE_DOUBLE_QUOTE = /^"/
const RE_STRING_DOUBLE_QUOTE_CONTENT = /^[^"]+/
const RE_STRING_SINGLE_QUOTE_CONTENT = /^[^']+/
const RE_SINGLE_QUOTE = /^'/
const RE_ANYTHING_BUT_CURLY = /^[^\{\}]+/s
const RE_LINE_COMMENT = /^\/\/.*/s
const RE_KEYWORD =
  /^(?:var|let|fn|for|struct|vec2|f32|if|elseif|else|mat4x4|vec4|return)\b/

const RE_PUNCTUATION = /^[\{\}\[\]\(\)\.\;\<\>\=\+\-\:\*\/\&>\?\@\<\>\,]/

export const initialLineState = {
  state: State.TopLevelContent,
  tokens: [],
  stack: [],
}

/**
 * @param {any} lineStateA
 * @param {any} lineStateB
 */
export const isEqualLineState = (lineStateA, lineStateB) => {
  return lineStateA.state === lineStateB.state
}

export const hasArrayReturn = true

/**
 * @param {string} line
 * @param {any} lineState
 */
export const tokenizeLine = (line, lineState) => {
  let next = null
  let index = 0
  let tokens = []
  let token = TokenType.None
  let state = lineState.state
  const stack = lineState.stack
  while (index < line.length) {
    const part = line.slice(index)
    switch (state) {
      case State.TopLevelContent:
        if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Whitespace
          state = State.TopLevelContent
        } else if ((next = part.match(RE_LINE_COMMENT))) {
          token = TokenType.Comment
          state = State.TopLevelContent
        } else if ((next = part.match(RE_KEYWORD))) {
          switch (next[0]) {
            case 'let':
            case 'var':
              token = TokenType.Keyword
              state = State.AfterKeywordDeclaration
              break
            case 'if':
            case 'elseif':
            case 'else':
              token = TokenType.KeywordControl
              state = State.TopLevelContent
              break
            case 'return':
              token = TokenType.KeywordReturn
              state = State.TopLevelContent
              break
            case 'vec4':
            case 'vec2':
            case 'f32':
            case 'i32':
            case 'mat4x4':
              token = TokenType.Type
              state = State.TopLevelContent
              break
            default:
              token = TokenType.Keyword
              state = State.TopLevelContent
              break
          }
        } else if ((next = part.match(RE_PUNCTUATION))) {
          token = TokenType.Punctuation
          state = State.TopLevelContent
        } else if ((next = part.match(RE_VARIABLE_NAME))) {
          token = TokenType.Variable
          state = State.TopLevelContent
        } else if ((next = part.match(RE_ANYTHING))) {
          token = TokenType.Unknown
          state = State.TopLevelContent
        } else {
          part //?
          throw new Error('no')
        }
        break
      case State.AfterKeywordDeclaration:
        if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Whitespace
          state = State.AfterKeywordDeclaration
        } else if ((next = part.match(RE_PUNCTUATION))) {
          token = TokenType.Punctuation
          state = State.AfterKeywordDeclaration
        } else if ((next = part.match(RE_VARIABLE_NAME))) {
          token = TokenType.Variable
          state = State.TopLevelContent
        } else if ((next = part.match(RE_ANYTHING))) {
          token = TokenType.Unknown
          state = State.TopLevelContent
        } else {
          throw new Error('no')
        }
        break
      default:
        throw new Error('no')
    }
    const tokenLength = next[0].length
    index += tokenLength
    tokens.push(token, tokenLength)
  }
  return {
    state,
    tokens,
    stack,
  }
}
