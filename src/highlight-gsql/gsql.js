/*
Language: GSQL
Contributors: Dan Barkus <daniel.barkus@tigergraph.com>
Description: GSQL language for TigerGraph
Website: https://www.tigergraph.com/
*/

export default function(hljs) {
    return {
      name: "GSQL",
      keywords: 
      {
          keyword: 'accum and any api as asc avg bag batch between bool both break by case catch coalesce compress continue count create datetime datetime_add datetime_sub delete desc distributed do double edge else end escape exception false file filter float foreach for from graph group gsql_int_max gsql_int_min gsql_uint_max having if in insert int interpret intersect interval into is isempty jsonarray jsonobject lasthop leading like limit list load_accum log map match max min minus not now null offset or order path per pinned post_accum post-accum primary_id print query raise range replace reset_collection_accum return returns run sample select select_vertex set src static string sum syntax target tagstgt then to to_csv to_datetime trailing trim true try tuple typedef uint union update values vertex when where while with',
          literal: 'true false null'
      },
      contains: [
        //   hljs.QUOTE_STRING_MODE,
        //   hljs.APOS_STRING_MODE,
          hljs.C_NUMBER_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.HASH_COMMENT_MODE,
          {
              className: 'clause',
              keywords: {
                  built_in: 'accum having limit order postAccum sample where'
              }
          },
          {
              className: 'accum',
              keywords: {
                  built_in: 'andaccum arrayaccum avgaccum bagaccum bitwiseandaccum bitwiseoraccum groupbyaccum heapaccum listaccum MapAccum maxaccum minaccum oraccum setaccum sumaccum'
              }
          },
          {
              className: 'relation',
              begin: /(-\s?)(\(.*\:\w?\))(\s?-)/,
          }
      ]
    }
  }