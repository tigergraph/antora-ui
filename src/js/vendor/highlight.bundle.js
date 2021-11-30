// var path = require('path');
// var filePath = path.join('..', '..', 'highlight-gsql', 'gsql.js');
// console.log(filePath);

;(function () {
  'use strict'

  var hljs = require('highlight.js/lib/highlight')
  hljs.registerLanguage('asciidoc', require('highlight.js/lib/languages/asciidoc'))
  hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'))
  hljs.registerLanguage('clojure', require('highlight.js/lib/languages/clojure'))
  hljs.registerLanguage('cpp', require('highlight.js/lib/languages/cpp'))
  hljs.registerLanguage('cs', require('highlight.js/lib/languages/cs'))
  hljs.registerLanguage('css', require('highlight.js/lib/languages/css'))
  hljs.registerLanguage('diff', require('highlight.js/lib/languages/diff'))
  hljs.registerLanguage('dockerfile', require('highlight.js/lib/languages/dockerfile'))
  hljs.registerLanguage('elixir', require('highlight.js/lib/languages/elixir'))
  hljs.registerLanguage('go', require('highlight.js/lib/languages/go'))
  hljs.registerLanguage('groovy', require('highlight.js/lib/languages/groovy'))
  hljs.registerLanguage('haskell', require('highlight.js/lib/languages/haskell'))
  hljs.registerLanguage('java', require('highlight.js/lib/languages/java'))
  hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
  hljs.registerLanguage('json', require('highlight.js/lib/languages/json'))
  hljs.registerLanguage('kotlin', require('highlight.js/lib/languages/kotlin'))
  hljs.registerLanguage('markdown', require('highlight.js/lib/languages/markdown'))
  hljs.registerLanguage('nix', require('highlight.js/lib/languages/nix'))
  hljs.registerLanguage('objectivec', require('highlight.js/lib/languages/objectivec'))
  hljs.registerLanguage('perl', require('highlight.js/lib/languages/perl'))
  hljs.registerLanguage('php', require('highlight.js/lib/languages/php'))
  hljs.registerLanguage('properties', require('highlight.js/lib/languages/properties'))
  hljs.registerLanguage('puppet', require('highlight.js/lib/languages/puppet'))
  hljs.registerLanguage('python', require('highlight.js/lib/languages/python'))
  hljs.registerLanguage('ruby', require('highlight.js/lib/languages/ruby'))
  hljs.registerLanguage('rust', require('highlight.js/lib/languages/rust'))
  hljs.registerLanguage('scala', require('highlight.js/lib/languages/scala'))
  hljs.registerLanguage('shell', require('highlight.js/lib/languages/shell'))
  hljs.registerLanguage('sql', require('highlight.js/lib/languages/sql'))
  hljs.registerLanguage('swift', require('highlight.js/lib/languages/swift'))
  hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
  hljs.registerLanguage('yaml', require('highlight.js/lib/languages/yaml'))
  hljs.registerLanguage('ebnf', require('highlight.js/lib/languages/ebnf'))
  hljs.registerLanguage('graphql', function hljsDefineGraphQL (hljs) {
    return {
      aliases: ['gql'],
      keywords: {
        keyword:
          'query mutation subscription|10 input schema implements type interface union scalar fragment|10 enum on ...',
        literal: 'ID ID! String Float Int Boolean',
        variable: 'true false null',
      },
      contains: [
        hljs.HASH_COMMENT_MODE,
        hljs.QUOTE_STRING_MODE,
        hljs.NUMBER_MODE,
        {
          className: 'literal',
          begin: '[^\\w][A-Z][a-z]',
          end: '\\W',
          excludeEnd: true,
        },
        {
          className: 'literal',
          begin: ':\\s\\[',
          end: '[\\]!]{1,3}',
          excludeBegin: true,
          excludeEnd: true,
        },
        {
          className: 'type',
          begin: '[^\\w](?!ID)[A-Z][A-Z]',
          end: '\\W',
          excludeEnd: true,
        },
        {
          className: 'name',
          begin: '\\$',
          end: '\\W',
          excludeEnd: true,
        },
        {
          className: 'meta',
          begin: '@',
          end: '\\W',
          excludeEnd: true,
        },
      ],
      illegal: /([;<']|BEGIN)/,
    }
  })
  hljs.registerLanguage('gsql', function (hljs) {
    'use strict'
    const ACCUMULATORS = 'AndAccum ArrayAccum AvgAccum BagAccum ' +
      'BitwiseAndAccum BitwiseOrAccum GroupByAccum HeapAccum ' +
      'ListAccum MapAccum MaxAccum MinAccum  OrAccum SetAccum SumAccum '
    const DATATYPES = 'BAG BOOL COMPRESS DATETIME DIRECTED  DOUBLE EDGE ' +
      'FILE FIXED_BINARY FLOAT INT JSONARRAY  JSONOBJECT LIST MAP SET ' +
      'STATIC STRING TUPLE UINT UNDIRECTED VERTEX '
    const FUNCTIONS = 'abs acos addTags ascii asin atan atan2 avg ceil' +
      ' chr clear coalesce concat contains containsKey cos cosh count ' +
      'datetime_add datetime_diff datetime_format datetime_sub ' +
      'datetime_to_epoch day degrees difference differenceTags ' +
      'edgeAttribute epoch_to_datetime evaluate exp filter find_in_set ' +
      'flatten flatten_json_array float_to_int floor fmod get getAttr ' +
      'getBool getDouble getInt getJsonArray getJsonObject getString ' +
      'getTags getvid gsql_concat gsql_current_time_epoch gsql_day ' +
      'gsql_day_epoch gsql_find gsql_is_false gsql_is_not_empty_string ' +
      'gsql_is_true gsql_length gsql_lower gsql_ltrim gsql_month ' +
      'gsql_month_epoch gsql_regex_match gsql_regex_replace ' +
      'gsql_replace gsql_reverse gsql_rtrim gsql_split_by_space ' +
      'gsql_substring gsql_to_bool gsql_to_int gsql_to_uint ' +
      'gsql_token_equal gsql_token_ignore_case_equal gsql_trim ' +
      'gsql_ts_to_epoch_seconds gsql_upper gsql_uuid_v4 gsql_year ' +
      'gsql_year_epoch hasTags hour ignore_if_exists instr ' +
      'intersectTags isDirected isTaggable ldexp left length log log10 ' +
      'log2 lower lpad ltrim max min minute month neighborAttribute ' +
      'neighbors now outdegree overwrite parse_json_array ' +
      'parse_json_object PI pop pow println radians rand reallocate ' +
      'reduce remove removeAll removeAllTags removeTags replace resize ' +
      'right round rpad rtrim second selectVertex setAttr sign sin ' +
      'sinh size soundex space split sqrt square str_to_int substr ' +
      'sum tan tanh to_datetime to_float to_int to_string to_vertex ' +
      'to_vertex_set token_len top translate trim trunc type update' +
      ' upper year '
    const LITERALS = 'ANY FALSE GSQL_INT_MAX GSQL_INT_MIN GSQL_UINT_MAX ' +
      'NULL TRUE '
    const OPERATORS = 'AND BETWEEN ESCAPE IN INTERSECT LIKE MINUS NOT OR' +
      ' UNION '
    const PRIVILEGES = 'ACCESS_TAG EXECUTE_LOADINGJOB READ_DATA ' +
      'READ_LOADINGJOB READ_PROXYGROUP READ_QUERY ' +
      'READ_ROLE READ_SCHEMA READ_USER WRITE_DATA ' +
      'WRITE_DATASOURCE WRITE_LOADINGJOB WRITE_QUERY ' +
      'WRITE_ROLE WRITE_SCHEMA '
    const ROLES = 'admin designer globaldesigner observer ' +
      'queryreader querywriter superuser '
    const RESERVED_WORDS = 'ACCUM ADD ALL ALLOCATE ALTER API AS ASC ' +
      'BATCH BIGINT BLOB BOOLEAN BOTH BREAK BY CALL ' +
      'CASCADE CASE CATCH CHAR CHARACTER CHECK CLOB CONST ' +
      'CONSTRAINT CONTINUE CREATE CURRENT_DATE ' +
      'CURRENT_TIME CURRENT_TIMESTAMP CURSOR DATA_SOURCE ' +
      'DECIMAL DECLARE DEFAULT DEFINE DELETE DESC ' +
      'DISTRIBUTED DO DROP ELSE ELSEIF END EOL EXCEPTION ' +
      'EXISTS EXPRFUNCTIONS EXPRUTIL FILENAME FOR FOREACH ' +
      'FROM GLOBAL GRAPH GROUP HAVING HEADER IF IGNORE ' +
      'INDEX INPUT_LINE_FILTER INSERT INT16 INT32 INT32_T ' +
      'INT64_T INT8 INTEGER INTERPRET INTERVAL INTO IS ' +
      'ISEMPTY JOB JOIN JSON_FILE KAFKA KEY LASTHOP ' +
      'LEADING LIMIT LOAD LOAD_ACCUM LOADACCUM LOADING ' +
      'LONG MATCH NEW_VERTEX_ONLY OFFSET ON ORDER PATH PER ' +
      'PINNED POST_ACCUM PRIMARY PRIMARY_ID PRINT PROXY ' +
      'QUERY QUIT QUOTE RAISE RANGE REJECT_LINE_RULE ' +
      'RESET_COLLECTION_ACCUM RETURN RETURNS RUN S3 SAMPLE ' +
      'SELECT SELECT_VERTEX SEPARATOR SPLIT SRC SYNTAX ' +
      'TAGS TARGET TEMP_TABLE TGT THEN TO TO_CSV TOKEN ' +
      'TOKENBANK TRAILING TRY TYPEDEF UINT16 UINT32 ' +
      'UINT32_T UINT64_T UINT8 UINT8_T UPSERT ' +
      'USER_DEFINED_HEADER USING VALUES VERTEX_MUST_EXIST ' +
      'WHEN WHERE WHILE WITH '
    const NON_RESERVED_WORDS = 'ABORT APPROX_COUNT ATTRIBUTE BEGIN ' +
      'CHANGE DATA DATASRC DECRYPT DESCRIPTION EMPTY EXIT ' +
      'EXPORT EXPR_FUNC EXPR_UTIL EXTERN FILENAMEVAR ' +
      'FLATTENJSON GENERATEDATA GRANT HELP ICON IMPORT ' +
      'INSTALL JSON LOCAL LS NUMERIC OPTION PAIR PASSWORD ' +
      'PUT RECOMPILE RESUME REVOKE ROLE SCHEMA ' +
      'SCHEMA_CHANGE SECONDARY_ID SECRET SHOW STATS STATUS ' +
      'STORE TAG TEMPLATE TK TOFLOAT TOINT TOKEN_BANK ' +
      'TOKENLEN USE USER USERS VAL VECTOR VERSION VOID '
    const GSQL_SESSION_PARAMS = 'exit_on_error gsql_src_dir' +
      ' query_timeout sys data_root '
    return {
      name: 'GSQL',
      case_insensitive: true,
      keywords: {
        keyword: FUNCTIONS + OPERATORS + PRIVILEGES + ROLES +
          RESERVED_WORDS + NON_RESERVED_WORDS + GSQL_SESSION_PARAMS,
        type: ACCUMULATORS + DATATYPES,
        literal: LITERALS,
      },
      contains: [
        hljs.QUOTE_STRING_MODE,
        hljs.HASH_COMMENT_MODE,
        hljs.NUMBER_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.COMMENT('//', '$'),
        {
          className: 'keyword',
          begin: 'POST-ACCUM',
        },
        {
          className: 'variable',
          begin: '@@?[a-zA-Z0-9_]+',
        },
        {
          className: 'meta',
          begin: '-\\(|\\)->|\\)-|\'',
        },
        {
          className: 'symbol',
          begin: '\\+=|-=|>=|<=|!=|>>|<<|->|=|\\+|-|\\*|\\/|%|<|>|\\||&',
        },
        {
          className: 'punctuation',
          begin: '\\.|,|:|;|\\(|\\)|\\{|\\}|\\[|\\]',
        }],
    }
  })
  ;[].slice.call(document.querySelectorAll('pre code.hljs')).forEach(function (node) {
    hljs.highlightBlock(node)
  })
})()
