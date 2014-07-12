define({ api: [
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "field": "bid",
            "optional": false,
            "description": "Bet bid"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "result",
            "optional": false,
            "description": "Bet result"
          }
        ]
      }
    },
    "group": "bet.js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./controllers/bet.js"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Bet identifier"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "bid",
            "optional": false,
            "description": "Bet bid"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "result",
            "optional": false,
            "description": "Bet result"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user": [
          {
            "group": "user",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "user",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "user",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "user",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "user",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "user",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "user",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "user",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "user",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user history": [
          {
            "group": "user history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "user history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ],
        "match": [
          {
            "group": "match",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Match identifier."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "round",
            "optional": false,
            "description": "Match round."
          },
          {
            "group": "match",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Match date."
          },
          {
            "group": "match",
            "type": "Boolean",
            "field": "finished",
            "optional": false,
            "description": "Match status."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "elapsed",
            "optional": false,
            "description": "Match elapsed time."
          },
          {
            "group": "match",
            "type": "String",
            "field": "winner",
            "optional": false,
            "description": "Match winner."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "jackpot",
            "optional": false,
            "description": "Match total pot."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "reward",
            "optional": false,
            "description": "Match reward."
          },
          {
            "group": "match",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "match",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "match score": [
          {
            "group": "match score",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest team score."
          },
          {
            "group": "match score",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host team score."
          }
        ],
        "match pot": [
          {
            "group": "match pot",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest total bets."
          },
          {
            "group": "match pot",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host total bets."
          },
          {
            "group": "match pot",
            "type": "Number",
            "field": "draw",
            "optional": false,
            "description": "Match draw total bets."
          }
        ],
        "match guest": [
          {
            "group": "match guest",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Guest team name."
          },
          {
            "group": "match guest",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Guest team picture."
          },
          {
            "group": "match guest",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Guest team identifier."
          },
          {
            "group": "match guest",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "match guest",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "match host": [
          {
            "group": "match host",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Host team name."
          },
          {
            "group": "match host",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Host team picture."
          },
          {
            "group": "match host",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Host team identifier."
          },
          {
            "group": "match host",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "match host",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "group": "bet.js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./controllers/bet.js"
  },
  {
    "type": "post",
    "url": "/championships/:championship/matches/:match/bets",
    "title": "Creates a new bet in database.",
    "name": "createBet",
    "version": "2.0.1",
    "group": "bet",
    "permission": "user",
    "description": "Creates a new bet in database.",
    "error": {
      "examples": [
        {
          "title": "    HTTP/1.1 400 Bad Request",
          "content": "   {\n     \"bid\": \"required\",\n     \"result\": \"required\"\n   }\n"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 201 Created",
          "content": "   {\n     \"slug\": \"vandoren\",\n     \"user\": {\n       \"slug\": \"vandoren\",\n       \"email\": \"vandoren@vandoren.com\",\n       \"username\": \"vandoren\",\n       \"name\": \"Van Doren\",\n       \"about\": \"footbl fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"2\",\n       \"previousRanking\": \"1\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"match\": {\n       \"slug\": \"brasilerao-brasil-2014-3-fluminense-vs-botafogo\"\n       \"guest\": {\n         \"name\": \"fluminense\",\n         \"slug\": \"fluminense\",\n         \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n         \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n         \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n       },\n       \"host\": {\n         \"name\": \"botafogo\",\n         \"slug\": \"botafogo\",\n         \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n         \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n         \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n       },\n       \"round\": 3,\n       \"date\": \"2014-07-01T12:22:25.058Z\",\n       \"finished\": true,\n       \"elapsed\": null,\n       \"score\": {\n         \"guest\": 0,\n         \"host\" 0\n       },\n       \"pot\": {\n         \"guest\": 0,\n         \"host\" 0,\n         \"draw\" 0\n       },\n       \"winner\": \"draw\",\n       \"jackpot\": 0,\n       \"reward\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Bet identifier"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "bid",
            "optional": false,
            "description": "Bet bid"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "result",
            "optional": false,
            "description": "Bet result"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user": [
          {
            "group": "user",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "user",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "user",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "user",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "user",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "user",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "user",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "user",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "user",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user history": [
          {
            "group": "user history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "user history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ],
        "match": [
          {
            "group": "match",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Match identifier."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "round",
            "optional": false,
            "description": "Match round."
          },
          {
            "group": "match",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Match date."
          },
          {
            "group": "match",
            "type": "Boolean",
            "field": "finished",
            "optional": false,
            "description": "Match status."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "elapsed",
            "optional": false,
            "description": "Match elapsed time."
          },
          {
            "group": "match",
            "type": "String",
            "field": "winner",
            "optional": false,
            "description": "Match winner."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "jackpot",
            "optional": false,
            "description": "Match total pot."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "reward",
            "optional": false,
            "description": "Match reward."
          },
          {
            "group": "match",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "match",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "match score": [
          {
            "group": "match score",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest team score."
          },
          {
            "group": "match score",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host team score."
          }
        ],
        "match pot": [
          {
            "group": "match pot",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest total bets."
          },
          {
            "group": "match pot",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host total bets."
          },
          {
            "group": "match pot",
            "type": "Number",
            "field": "draw",
            "optional": false,
            "description": "Match draw total bets."
          }
        ],
        "match guest": [
          {
            "group": "match guest",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Guest team name."
          },
          {
            "group": "match guest",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Guest team picture."
          },
          {
            "group": "match guest",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Guest team identifier."
          },
          {
            "group": "match guest",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "match guest",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "match host": [
          {
            "group": "match host",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Host team name."
          },
          {
            "group": "match host",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Host team picture."
          },
          {
            "group": "match host",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Host team identifier."
          },
          {
            "group": "match host",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "match host",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "field": "bid",
            "optional": false,
            "description": "Bet bid"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "result",
            "optional": false,
            "description": "Bet result"
          }
        ]
      }
    },
    "filename": "./controllers/bet.js"
  },
  {
    "type": "get",
    "url": "/championships/:championship/matches/:match/bets/:id",
    "title": "Get bet info in database",
    "name": "getBet",
    "version": "2.0.1",
    "group": "bet",
    "permission": "user",
    "description": "Get bet info in database.",
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"slug\": \"vandoren\",\n     \"user\": {\n       \"slug\": \"vandoren\",\n       \"email\": \"vandoren@vandoren.com\",\n       \"username\": \"vandoren\",\n       \"name\": \"Van Doren\",\n       \"about\": \"footbl fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"2\",\n       \"previousRanking\": \"1\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"match\": {\n       \"slug\": \"brasilerao-brasil-2014-3-fluminense-vs-botafogo\"\n       \"guest\": {\n         \"name\": \"fluminense\",\n         \"slug\": \"fluminense\",\n         \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n         \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n         \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n       },\n       \"host\": {\n         \"name\": \"botafogo\",\n         \"slug\": \"botafogo\",\n         \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n         \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n         \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n       },\n       \"round\": 3,\n       \"date\": \"2014-07-01T12:22:25.058Z\",\n       \"finished\": true,\n       \"elapsed\": null,\n       \"score\": {\n         \"guest\": 0,\n         \"host\" 0\n       },\n       \"pot\": {\n         \"guest\": 0,\n         \"host\" 0,\n         \"draw\" 0\n       },\n       \"winner\": \"draw\",\n       \"jackpot\": 0,\n       \"reward\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"bid\": 50,\n     \"result\": \"draw\",\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Bet identifier"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "bid",
            "optional": false,
            "description": "Bet bid"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "result",
            "optional": false,
            "description": "Bet result"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user": [
          {
            "group": "user",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "user",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "user",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "user",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "user",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "user",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "user",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "user",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "user",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user history": [
          {
            "group": "user history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "user history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ],
        "match": [
          {
            "group": "match",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Match identifier."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "round",
            "optional": false,
            "description": "Match round."
          },
          {
            "group": "match",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Match date."
          },
          {
            "group": "match",
            "type": "Boolean",
            "field": "finished",
            "optional": false,
            "description": "Match status."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "elapsed",
            "optional": false,
            "description": "Match elapsed time."
          },
          {
            "group": "match",
            "type": "String",
            "field": "winner",
            "optional": false,
            "description": "Match winner."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "jackpot",
            "optional": false,
            "description": "Match total pot."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "reward",
            "optional": false,
            "description": "Match reward."
          },
          {
            "group": "match",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "match",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "match score": [
          {
            "group": "match score",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest team score."
          },
          {
            "group": "match score",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host team score."
          }
        ],
        "match pot": [
          {
            "group": "match pot",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest total bets."
          },
          {
            "group": "match pot",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host total bets."
          },
          {
            "group": "match pot",
            "type": "Number",
            "field": "draw",
            "optional": false,
            "description": "Match draw total bets."
          }
        ],
        "match guest": [
          {
            "group": "match guest",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Guest team name."
          },
          {
            "group": "match guest",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Guest team picture."
          },
          {
            "group": "match guest",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Guest team identifier."
          },
          {
            "group": "match guest",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "match guest",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "match host": [
          {
            "group": "match host",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Host team name."
          },
          {
            "group": "match host",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Host team picture."
          },
          {
            "group": "match host",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Host team identifier."
          },
          {
            "group": "match host",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "match host",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "filename": "./controllers/bet.js"
  },
  {
    "type": "get",
    "url": "/championships/:championship/matches/:match/bets",
    "title": "List all bets in database",
    "name": "listBet",
    "version": "2.0.1",
    "group": "bet",
    "permission": "user",
    "description": "List all bets in database.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "page",
            "defaultValue": "0",
            "optional": true,
            "description": "The page to be displayed."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   [{\n     \"slug\": \"vandoren\",\n     \"user\": {\n       \"slug\": \"vandoren\",\n       \"email\": \"vandoren@vandoren.com\",\n       \"username\": \"vandoren\",\n       \"name\": \"Van Doren\",\n       \"about\": \"footbl fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"2\",\n       \"previousRanking\": \"1\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"match\": {\n       \"slug\": \"brasilerao-brasil-2014-3-fluminense-vs-botafogo\"\n       \"guest\": {\n         \"name\": \"fluminense\",\n         \"slug\": \"fluminense\",\n         \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n         \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n         \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n       },\n       \"host\": {\n         \"name\": \"botafogo\",\n         \"slug\": \"botafogo\",\n         \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n         \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n         \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n       },\n       \"round\": 3,\n       \"date\": \"2014-07-01T12:22:25.058Z\",\n       \"finished\": true,\n       \"elapsed\": null,\n       \"score\": {\n         \"guest\": 0,\n         \"host\" 0\n       },\n       \"pot\": {\n         \"guest\": 0,\n         \"host\" 0,\n         \"draw\" 0\n       },\n       \"winner\": \"draw\",\n       \"jackpot\": 0,\n       \"reward\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"bid\": 50,\n     \"result\": \"draw\",\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }]\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Bet identifier"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "bid",
            "optional": false,
            "description": "Bet bid"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "result",
            "optional": false,
            "description": "Bet result"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user": [
          {
            "group": "user",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "user",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "user",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "user",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "user",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "user",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "user",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "user",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "user",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user history": [
          {
            "group": "user history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "user history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ],
        "match": [
          {
            "group": "match",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Match identifier."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "round",
            "optional": false,
            "description": "Match round."
          },
          {
            "group": "match",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Match date."
          },
          {
            "group": "match",
            "type": "Boolean",
            "field": "finished",
            "optional": false,
            "description": "Match status."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "elapsed",
            "optional": false,
            "description": "Match elapsed time."
          },
          {
            "group": "match",
            "type": "String",
            "field": "winner",
            "optional": false,
            "description": "Match winner."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "jackpot",
            "optional": false,
            "description": "Match total pot."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "reward",
            "optional": false,
            "description": "Match reward."
          },
          {
            "group": "match",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "match",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "match score": [
          {
            "group": "match score",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest team score."
          },
          {
            "group": "match score",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host team score."
          }
        ],
        "match pot": [
          {
            "group": "match pot",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest total bets."
          },
          {
            "group": "match pot",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host total bets."
          },
          {
            "group": "match pot",
            "type": "Number",
            "field": "draw",
            "optional": false,
            "description": "Match draw total bets."
          }
        ],
        "match guest": [
          {
            "group": "match guest",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Guest team name."
          },
          {
            "group": "match guest",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Guest team picture."
          },
          {
            "group": "match guest",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Guest team identifier."
          },
          {
            "group": "match guest",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "match guest",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "match host": [
          {
            "group": "match host",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Host team name."
          },
          {
            "group": "match host",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Host team picture."
          },
          {
            "group": "match host",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Host team identifier."
          },
          {
            "group": "match host",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "match host",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "filename": "./controllers/bet.js"
  },
  {
    "type": "delete",
    "url": "/championships/:championship/matches/:match/bets/:id",
    "title": "Removes bet from database",
    "name": "removeBet",
    "version": "2.0.1",
    "group": "bet",
    "permission": "user",
    "description": "Removes bet from database",
    "filename": "./controllers/bet.js"
  },
  {
    "type": "put",
    "url": "/championships/:championship/matches/:match/bets/:id",
    "title": "Updates bet info in database",
    "name": "updateBet",
    "version": "2.0.1",
    "group": "bet",
    "permission": "user",
    "description": "Updates bet info in database.",
    "error": {
      "examples": [
        {
          "title": "    HTTP/1.1 400 Bad Request",
          "content": "   {\n     \"bid\": \"required\",\n     \"result\": \"required\"\n   }\n"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"slug\": \"vandoren\",\n     \"user\": {\n       \"slug\": \"vandoren\",\n       \"email\": \"vandoren@vandoren.com\",\n       \"username\": \"vandoren\",\n       \"name\": \"Van Doren\",\n       \"about\": \"footbl fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"2\",\n       \"previousRanking\": \"1\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"match\": {\n       \"slug\": \"brasilerao-brasil-2014-3-fluminense-vs-botafogo\"\n       \"guest\": {\n         \"name\": \"fluminense\",\n         \"slug\": \"fluminense\",\n         \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n         \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n         \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n       },\n       \"host\": {\n         \"name\": \"botafogo\",\n         \"slug\": \"botafogo\",\n         \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n         \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n         \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n       },\n       \"round\": 3,\n       \"date\": \"2014-07-01T12:22:25.058Z\",\n       \"finished\": true,\n       \"elapsed\": null,\n       \"score\": {\n         \"guest\": 0,\n         \"host\" 0\n       },\n       \"pot\": {\n         \"guest\": 0,\n         \"host\" 0,\n         \"draw\" 0\n       },\n       \"winner\": \"draw\",\n       \"jackpot\": 0,\n       \"reward\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"bid\": 50,\n     \"result\": \"draw\",\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Bet identifier"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "bid",
            "optional": false,
            "description": "Bet bid"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "result",
            "optional": false,
            "description": "Bet result"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user": [
          {
            "group": "user",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "user",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "user",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "user",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "user",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "user",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "user",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "user",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "user",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user history": [
          {
            "group": "user history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "user history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ],
        "match": [
          {
            "group": "match",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Match identifier."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "round",
            "optional": false,
            "description": "Match round."
          },
          {
            "group": "match",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Match date."
          },
          {
            "group": "match",
            "type": "Boolean",
            "field": "finished",
            "optional": false,
            "description": "Match status."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "elapsed",
            "optional": false,
            "description": "Match elapsed time."
          },
          {
            "group": "match",
            "type": "String",
            "field": "winner",
            "optional": false,
            "description": "Match winner."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "jackpot",
            "optional": false,
            "description": "Match total pot."
          },
          {
            "group": "match",
            "type": "Number",
            "field": "reward",
            "optional": false,
            "description": "Match reward."
          },
          {
            "group": "match",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "match",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "match score": [
          {
            "group": "match score",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest team score."
          },
          {
            "group": "match score",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host team score."
          }
        ],
        "match pot": [
          {
            "group": "match pot",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest total bets."
          },
          {
            "group": "match pot",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host total bets."
          },
          {
            "group": "match pot",
            "type": "Number",
            "field": "draw",
            "optional": false,
            "description": "Match draw total bets."
          }
        ],
        "match guest": [
          {
            "group": "match guest",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Guest team name."
          },
          {
            "group": "match guest",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Guest team picture."
          },
          {
            "group": "match guest",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Guest team identifier."
          },
          {
            "group": "match guest",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "match guest",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "match host": [
          {
            "group": "match host",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Host team name."
          },
          {
            "group": "match host",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Host team picture."
          },
          {
            "group": "match host",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Host team identifier."
          },
          {
            "group": "match host",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "match host",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "field": "bid",
            "optional": false,
            "description": "Bet bid"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "result",
            "optional": false,
            "description": "Bet result"
          }
        ]
      }
    },
    "filename": "./controllers/bet.js"
  },
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Championship name."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "picture",
            "optional": true,
            "description": "Championship picture for display."
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "year",
            "optional": false,
            "description": "Championship year of occurrence."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "type",
            "defaultValue": "national league",
            "optional": true,
            "description": "Championship type."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "country",
            "optional": false,
            "description": "Championship country of occurrence."
          }
        ]
      }
    },
    "group": "championship.js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./controllers/championship.js"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Championship name."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Championship identifier."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Championship picture for display."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "year",
            "optional": false,
            "description": "Championship year of occurrence."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "type",
            "optional": false,
            "description": "Championship type."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "country",
            "optional": false,
            "description": "Championship country of occurrence."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "rounds",
            "optional": false,
            "description": "Championship number of rounds."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "currentRound",
            "optional": false,
            "description": "Championship current round."
          }
        ]
      }
    },
    "group": "championship.js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./controllers/championship.js"
  },
  {
    "type": "post",
    "url": "/championships",
    "title": "Creates a new championship.",
    "name": "createChampionship",
    "version": "2.0.1",
    "group": "championship",
    "permission": "admin",
    "description": "Creates a new championship.",
    "error": {
      "examples": [
        {
          "title": "    HTTP/1.1 400 Bad Request",
          "content": "   {\n     \"name\": \"required\",\n     \"edition\": \"required\",\n     \"country\": \"required\",\n     \"type\": \"enum\"\n   }\n"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 201 Created",
          "content": "   {\n     \"name\": \"Brasileirão\",\n     \"slug\": \"brasileirao-brasil-2014\",\n     \"country\" : \"brasil\",\n     \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n     \"edition\": 2014,\n     \"type\": \"national league\",\n     \"rounds\": 7,\n     \"currentRound\" : 4,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Championship name."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Championship identifier."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Championship picture for display."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "year",
            "optional": false,
            "description": "Championship year of occurrence."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "type",
            "optional": false,
            "description": "Championship type."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "country",
            "optional": false,
            "description": "Championship country of occurrence."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "rounds",
            "optional": false,
            "description": "Championship number of rounds."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "currentRound",
            "optional": false,
            "description": "Championship current round."
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Championship name."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "picture",
            "optional": true,
            "description": "Championship picture for display."
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "year",
            "optional": false,
            "description": "Championship year of occurrence."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "type",
            "defaultValue": "national league",
            "optional": true,
            "description": "Championship type."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "country",
            "optional": false,
            "description": "Championship country of occurrence."
          }
        ]
      }
    },
    "filename": "./controllers/championship.js"
  },
  {
    "type": "get",
    "url": "/championships/:id",
    "title": "Get championship info",
    "name": "getChampionship",
    "version": "2.0.1",
    "group": "championship",
    "permission": "user",
    "description": "Get championship info.",
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"name\": \"Brasileirão\",\n     \"slug\": \"brasileirao-brasil-2014\",\n     \"country\" : \"brasil\",\n     \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n     \"edition\": 2014,\n     \"type\": \"national league\",\n     \"rounds\": 7,\n     \"currentRound\" : 4,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Championship name."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Championship identifier."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Championship picture for display."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "year",
            "optional": false,
            "description": "Championship year of occurrence."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "type",
            "optional": false,
            "description": "Championship type."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "country",
            "optional": false,
            "description": "Championship country of occurrence."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "rounds",
            "optional": false,
            "description": "Championship number of rounds."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "currentRound",
            "optional": false,
            "description": "Championship current round."
          }
        ]
      }
    },
    "filename": "./controllers/championship.js"
  },
  {
    "type": "get",
    "url": "/championships",
    "title": "List all championships",
    "name": "listChampionship",
    "version": "2.0.1",
    "group": "championship",
    "permission": "user",
    "description": "List all championships.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "page",
            "defaultValue": "0",
            "optional": true,
            "description": "The page to be displayed."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   [{\n     \"name\": \"Brasileirão\",\n     \"slug\": \"brasileirao-brasil-2014\",\n     \"country\" : \"brasil\",\n     \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n     \"edition\": 2014,\n     \"type\": \"national league\",\n     \"rounds\": 7,\n     \"currentRound\" : 4,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }]\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Championship name."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Championship identifier."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Championship picture for display."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "year",
            "optional": false,
            "description": "Championship year of occurrence."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "type",
            "optional": false,
            "description": "Championship type."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "country",
            "optional": false,
            "description": "Championship country of occurrence."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "rounds",
            "optional": false,
            "description": "Championship number of rounds."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "currentRound",
            "optional": false,
            "description": "Championship current round."
          }
        ]
      }
    },
    "filename": "./controllers/championship.js"
  },
  {
    "type": "delete",
    "url": "/championships/:id",
    "title": "Removes championship",
    "name": "removeChampionship",
    "version": "2.0.1",
    "group": "championship",
    "permission": "admin",
    "description": "Removes championship",
    "filename": "./controllers/championship.js"
  },
  {
    "type": "put",
    "url": "/championships/:id",
    "title": "Updates championship info",
    "name": "updateChampionship",
    "version": "2.0.1",
    "group": "championship",
    "permission": "admin",
    "description": "Updates championship info.",
    "error": {
      "examples": [
        {
          "title": "    HTTP/1.1 400 Bad Request",
          "content": "   {\n     \"name\": \"required\",\n     \"edition\": \"required\",\n     \"country\": \"required\",\n     \"type\": \"enum\"\n   }\n"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"name\": \"Brasileirão\",\n     \"slug\": \"brasileirao-brasil-2014\",\n     \"country\" : \"brasil\",\n     \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n     \"edition\": 2014,\n     \"type\": \"national league\",\n     \"rounds\": 7,\n     \"currentRound\" : 4,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Championship name."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Championship identifier."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Championship picture for display."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "year",
            "optional": false,
            "description": "Championship year of occurrence."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "type",
            "optional": false,
            "description": "Championship type."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "country",
            "optional": false,
            "description": "Championship country of occurrence."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "rounds",
            "optional": false,
            "description": "Championship number of rounds."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "currentRound",
            "optional": false,
            "description": "Championship current round."
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Championship name."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "picture",
            "optional": true,
            "description": "Championship picture for display."
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "year",
            "optional": false,
            "description": "Championship year of occurrence."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "type",
            "defaultValue": "national league",
            "optional": true,
            "description": "Championship type."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "country",
            "optional": false,
            "description": "Championship country of occurrence."
          }
        ]
      }
    },
    "filename": "./controllers/championship.js"
  },
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "featured",
            "optional": false,
            "description": "Featured user"
          }
        ]
      }
    },
    "group": "featured.js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./controllers/featured.js"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Featured identifier"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "featured": [
          {
            "group": "featured",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "featured",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "featured",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "featured",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "featured",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "featured history": [
          {
            "group": "featured history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "featured history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ]
      }
    },
    "group": "featured.js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./controllers/featured.js"
  },
  {
    "type": "post",
    "url": "/users/:user/featured",
    "title": "Creates a new featured.",
    "name": "createFeatured",
    "version": "2.0.1",
    "group": "featured",
    "permission": "user",
    "description": "Creates a new featured.",
    "error": {
      "examples": [
        {
          "title": "    HTTP/1.1 400 Bad Request",
          "content": "   {\n     \"featured\": \"required\"\n   }\n"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 201 Created",
          "content": "   {\n     \"slug\": \"vandoren\",\n     \"featured\": {\n       \"slug\": \"vandoren\",\n       \"email\": \"vandoren@vandoren.com\",\n       \"username\": \"vandoren\",\n       \"name\": \"Van Doren\",\n       \"about\": \"footbl fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"2\",\n       \"previousRanking\": \"1\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"user\": {\n       \"slug\": \"fan\",\n       \"email\": \"fan@vandoren.com\",\n       \"username\": \"fan\",\n       \"name\": \"Fan\",\n       \"about\": \"vandoren fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"3\",\n       \"previousRanking\": \"2\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Featured identifier"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "featured": [
          {
            "group": "featured",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "featured",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "featured",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "featured",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "featured",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "featured history": [
          {
            "group": "featured history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "featured history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "featured",
            "optional": false,
            "description": "Featured user"
          }
        ]
      }
    },
    "filename": "./controllers/featured.js"
  },
  {
    "type": "get",
    "url": "/users/:user/featured/:id",
    "title": "Get featured info",
    "name": "getFeatured",
    "version": "2.0.1",
    "group": "featured",
    "permission": "user",
    "description": "Get featured info.",
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"slug\": \"vandoren\",\n     \"featured\": {\n       \"slug\": \"vandoren\",\n       \"email\": \"vandoren@vandoren.com\",\n       \"username\": \"vandoren\",\n       \"name\": \"Van Doren\",\n       \"about\": \"footbl fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"2\",\n       \"previousRanking\": \"1\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"user\": {\n       \"slug\": \"fan\",\n       \"email\": \"fan@vandoren.com\",\n       \"username\": \"fan\",\n       \"name\": \"Fan\",\n       \"about\": \"vandoren fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"3\",\n       \"previousRanking\": \"2\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Featured identifier"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "featured": [
          {
            "group": "featured",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "featured",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "featured",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "featured",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "featured",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "featured history": [
          {
            "group": "featured history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "featured history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ]
      }
    },
    "filename": "./controllers/featured.js"
  },
  {
    "type": "get",
    "url": "/users/:user/featured",
    "title": "List all featured",
    "name": "listFeatured",
    "version": "2.0.1",
    "group": "featured",
    "permission": "user",
    "description": "List all featured.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "page",
            "defaultValue": "0",
            "optional": true,
            "description": "The page to be displayed."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   [{\n     \"slug\": \"vandoren\",\n     \"featured\": {\n       \"slug\": \"vandoren\",\n       \"email\": \"vandoren@vandoren.com\",\n       \"username\": \"vandoren\",\n       \"name\": \"Van Doren\",\n       \"about\": \"footbl fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"2\",\n       \"previousRanking\": \"1\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"user\": {\n       \"slug\": \"fan\",\n       \"email\": \"fan@vandoren.com\",\n       \"username\": \"fan\",\n       \"name\": \"Fan\",\n       \"about\": \"vandoren fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"3\",\n       \"previousRanking\": \"2\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }]\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Featured identifier"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "featured": [
          {
            "group": "featured",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "featured",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "featured",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "featured",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "featured",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "featured history": [
          {
            "group": "featured history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "featured history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ]
      }
    },
    "filename": "./controllers/featured.js"
  },
  {
    "type": "get",
    "url": "/users/:user/fans",
    "title": "List all user fans",
    "name": "listFeatured",
    "version": "2.0.1",
    "group": "featured",
    "permission": "user",
    "description": "List all featured.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "page",
            "defaultValue": "0",
            "optional": true,
            "description": "The page to be displayed."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   [{\n     \"slug\": \"vandoren\",\n     \"featured\": {\n       \"slug\": \"vandoren\",\n       \"email\": \"vandoren@vandoren.com\",\n       \"username\": \"vandoren\",\n       \"name\": \"Van Doren\",\n       \"about\": \"footbl fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"2\",\n       \"previousRanking\": \"1\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"user\": {\n       \"slug\": \"fan\",\n       \"email\": \"fan@vandoren.com\",\n       \"username\": \"fan\",\n       \"name\": \"Fan\",\n       \"about\": \"vandoren fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"3\",\n       \"previousRanking\": \"2\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }]\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Featured identifier"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "featured": [
          {
            "group": "featured",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "featured",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "featured",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "featured",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "featured",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "featured history": [
          {
            "group": "featured history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "featured history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ]
      }
    },
    "filename": "./controllers/featured.js"
  },
  {
    "type": "delete",
    "url": "/users/:user/featured/:id",
    "title": "Removes featured",
    "name": "removeFeatured",
    "version": "2.0.1",
    "group": "featured",
    "permission": "user",
    "description": "Removes featured",
    "filename": "./controllers/featured.js"
  },
  {
    "type": "put",
    "url": "/users/:user/featured/:id",
    "title": "Updates featured info",
    "name": "updateFeatured",
    "version": "2.0.1",
    "group": "featured",
    "permission": "user",
    "description": "Updates featured info.",
    "error": {
      "examples": [
        {
          "title": "    HTTP/1.1 400 Bad Request",
          "content": "   {\n     \"featured\": \"required\"\n   }\n"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"slug\": \"vandoren\",\n     \"featured\": {\n       \"slug\": \"vandoren\",\n       \"email\": \"vandoren@vandoren.com\",\n       \"username\": \"vandoren\",\n       \"name\": \"Van Doren\",\n       \"about\": \"footbl fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"2\",\n       \"previousRanking\": \"1\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"user\": {\n       \"slug\": \"fan\",\n       \"email\": \"fan@vandoren.com\",\n       \"username\": \"fan\",\n       \"name\": \"Fan\",\n       \"about\": \"vandoren fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"3\",\n       \"previousRanking\": \"2\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Featured identifier"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "featured": [
          {
            "group": "featured",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "featured",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "featured",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "featured",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "featured",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "featured",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "featured",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "featured history": [
          {
            "group": "featured history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "featured history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "featured",
            "optional": false,
            "description": "Featured user"
          }
        ]
      }
    },
    "filename": "./controllers/featured.js"
  },
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "user",
            "optional": false,
            "description": "GroupMember user"
          }
        ]
      }
    },
    "group": "group-member.js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./controllers/group-member.js"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "GroupMember identifier."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "GroupMember current ranking"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "GroupMember previous ranking"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user": [
          {
            "group": "user",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "user",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "user",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "user",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "user",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "user",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "user",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "user",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "user",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user history": [
          {
            "group": "user history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "user history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ]
      }
    },
    "group": "group-member.js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./controllers/group-member.js"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Group name."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Group identifier."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Group picture for display."
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "freeToEdit",
            "optional": false,
            "description": "Tells if the group can be edited be any member."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "group": "group.js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./controllers/group.js"
  },
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Group name."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "picture",
            "optional": true,
            "description": "Group picture for display."
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "field": "freeToEdit",
            "defaultValue": "false",
            "optional": true,
            "description": "Tells if the group can be edited be any member."
          }
        ]
      }
    },
    "group": "group.js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./controllers/group.js"
  },
  {
    "type": "post",
    "url": "/groups/:group/members",
    "title": "Creates a new groupMember.",
    "name": "createGroupMember",
    "version": "2.0.1",
    "group": "groupMember",
    "permission": "user",
    "description": "Creates a new groupMember.",
    "error": {
      "examples": [
        {
          "title": "    HTTP/1.1 400 Bad Request",
          "content": "   {\n     \"user\": \"required\"\n   }\n"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 201 Created",
          "content": "   {\n     \"slug\": \"vandoren\",\n     \"user\": {\n       \"slug\": \"vandoren\",\n       \"email\": \"vandoren@vandoren.com\",\n       \"username\": \"vandoren\",\n       \"name\": \"Van Doren\",\n       \"about\": \"footbl fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"2\",\n       \"previousRanking\": \"1\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"ranking\": 1,\n     \"previousRanking\": 1,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "GroupMember identifier."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "GroupMember current ranking"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "GroupMember previous ranking"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user": [
          {
            "group": "user",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "user",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "user",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "user",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "user",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "user",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "user",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "user",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "user",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user history": [
          {
            "group": "user history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "user history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "user",
            "optional": false,
            "description": "GroupMember user"
          }
        ]
      }
    },
    "filename": "./controllers/group-member.js"
  },
  {
    "type": "get",
    "url": "/groups/:group/members/:id",
    "title": "Get groupMember info",
    "name": "getGroupMember",
    "version": "2.0.1",
    "group": "groupMember",
    "permission": "user",
    "description": "Get groupMember info.",
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"slug\": \"vandoren\",\n     \"user\": {\n       \"slug\": \"vandoren\",\n       \"email\": \"vandoren@vandoren.com\",\n       \"username\": \"vandoren\",\n       \"name\": \"Van Doren\",\n       \"about\": \"footbl fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"2\",\n       \"previousRanking\": \"1\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"ranking\": 1,\n     \"previousRanking\": 1,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "GroupMember identifier."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "GroupMember current ranking"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "GroupMember previous ranking"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user": [
          {
            "group": "user",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "user",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "user",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "user",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "user",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "user",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "user",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "user",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "user",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user history": [
          {
            "group": "user history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "user history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ]
      }
    },
    "filename": "./controllers/group-member.js"
  },
  {
    "type": "get",
    "url": "/groups/:group/members",
    "title": "List all groupMembers",
    "name": "listGroupMember",
    "version": "2.0.1",
    "group": "groupMember",
    "permission": "user",
    "description": "List all groupMembers.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "page",
            "defaultValue": "0",
            "optional": true,
            "description": "The page to be displayed."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   [{\n     \"slug\": \"vandoren\",\n     \"user\": {\n       \"slug\": \"vandoren\",\n       \"email\": \"vandoren@vandoren.com\",\n       \"username\": \"vandoren\",\n       \"name\": \"Van Doren\",\n       \"about\": \"footbl fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"2\",\n       \"previousRanking\": \"1\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"ranking\": 1,\n     \"previousRanking\": 1,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }]\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "GroupMember identifier."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "GroupMember current ranking"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "GroupMember previous ranking"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user": [
          {
            "group": "user",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "user",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "user",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "user",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "user",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "user",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "user",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "user",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "user",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user history": [
          {
            "group": "user history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "user history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ]
      }
    },
    "filename": "./controllers/group-member.js"
  },
  {
    "type": "delete",
    "url": "/groups/:group/members/:id",
    "title": "Removes groupMember",
    "name": "removeGroupMember",
    "version": "2.0.1",
    "group": "groupMember",
    "permission": "user",
    "description": "Removes groupMember",
    "filename": "./controllers/group-member.js"
  },
  {
    "type": "put",
    "url": "/groups/:group/members/:id",
    "title": "Updates groupMember info",
    "name": "updateGroupMember",
    "version": "2.0.1",
    "group": "groupMember",
    "permission": "user",
    "description": "Updates groupMember info.",
    "error": {
      "examples": [
        {
          "title": "    HTTP/1.1 400 Bad Request",
          "content": "   {\n     \"user\": \"required\"\n   }\n"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"slug\": \"vandoren\",\n     \"user\": {\n       \"slug\": \"vandoren\",\n       \"email\": \"vandoren@vandoren.com\",\n       \"username\": \"vandoren\",\n       \"name\": \"Van Doren\",\n       \"about\": \"footbl fan\",\n       \"verified\": false,\n       \"featured\": false,\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"ranking\": \"2\",\n       \"previousRanking\": \"1\",\n       \"history\": [{\n         \"date\": \"2014-07-01T12:22:25.058Z\",\n         \"funds\": 100\n       },{\n         \"date\": \"2014-07-03T12:22:25.058Z\",\n         \"funds\": 120\n       }],\n       \"funds\": 100,\n       \"stake\": 0,\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"ranking\": 1,\n     \"previousRanking\": 1,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "GroupMember identifier."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "GroupMember current ranking"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "GroupMember previous ranking"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user": [
          {
            "group": "user",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "user",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "user",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "user",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "user",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "user",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "user",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "user",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "user",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "user",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "user",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "user history": [
          {
            "group": "user history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "user history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "user",
            "optional": false,
            "description": "GroupMember user"
          }
        ]
      }
    },
    "filename": "./controllers/group-member.js"
  },
  {
    "type": "post",
    "url": "/groups",
    "title": "Creates a new group.",
    "name": "createGroup",
    "version": "2.0.1",
    "group": "group",
    "permission": "user",
    "description": "Creates a new group.",
    "error": {
      "examples": [
        {
          "title": "    HTTP/1.1 400 Bad Request",
          "content": "   {\n     \"name\": \"required\"\n   }\n"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 201 Created",
          "content": "   {\n     \"name\": \"College Buddies\",\n     \"slug\": \"abcde\",\n     \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n     \"freeToEdit\": false,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Group name."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Group identifier."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Group picture for display."
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "freeToEdit",
            "optional": false,
            "description": "Tells if the group can be edited be any member."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Group name."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "picture",
            "optional": true,
            "description": "Group picture for display."
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "field": "freeToEdit",
            "defaultValue": "false",
            "optional": true,
            "description": "Tells if the group can be edited be any member."
          }
        ]
      }
    },
    "filename": "./controllers/group.js"
  },
  {
    "type": "get",
    "url": "/groups/:id",
    "title": "Get group info",
    "name": "getGroup",
    "version": "2.0.1",
    "group": "group",
    "permission": "user",
    "description": "Get group info.",
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"name\": \"College Buddies\",\n     \"slug\": \"abcde\",\n     \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n     \"freeToEdit\": false,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Group name."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Group identifier."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Group picture for display."
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "freeToEdit",
            "optional": false,
            "description": "Tells if the group can be edited be any member."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "filename": "./controllers/group.js"
  },
  {
    "type": "post",
    "url": "/groups/:id/invite",
    "title": "Invites new user",
    "name": "inviteGroup",
    "version": "2.0.1",
    "group": "group",
    "permission": "user",
    "description": "Updates group info.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "invite",
            "optional": false,
            "description": "Invite"
          }
        ]
      }
    },
    "filename": "./controllers/group.js"
  },
  {
    "type": "get",
    "url": "/groups",
    "title": "List all groups",
    "name": "listGroup",
    "version": "2.0.1",
    "group": "group",
    "permission": "user",
    "description": "List all groups.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "page",
            "defaultValue": "0",
            "optional": true,
            "description": "The page to be displayed."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   [{\n     \"name\": \"College Buddies\",\n     \"slug\": \"abcde\",\n     \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n     \"freeToEdit\": false,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }]\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Group name."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Group identifier."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Group picture for display."
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "freeToEdit",
            "optional": false,
            "description": "Tells if the group can be edited be any member."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "filename": "./controllers/group.js"
  },
  {
    "type": "delete",
    "url": "/groups/:id",
    "title": "Removes group",
    "name": "removeGroup",
    "version": "2.0.1",
    "group": "group",
    "permission": "user",
    "description": "Removes group",
    "filename": "./controllers/group.js"
  },
  {
    "type": "put",
    "url": "/groups/:id",
    "title": "Updates group info",
    "name": "updateGroup",
    "version": "2.0.1",
    "group": "group",
    "permission": "user",
    "description": "Updates group info.",
    "error": {
      "examples": [
        {
          "title": "    HTTP/1.1 400 Bad Request",
          "content": "   {\n     \"name\": \"required\"\n   }\n"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"name\": \"College Buddies\",\n     \"slug\": \"abcde\",\n     \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n     \"freeToEdit\": false,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Group name."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Group identifier."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Group picture for display."
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "freeToEdit",
            "optional": false,
            "description": "Tells if the group can be edited be any member."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Group name."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "picture",
            "optional": true,
            "description": "Group picture for display."
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "field": "freeToEdit",
            "defaultValue": "false",
            "optional": true,
            "description": "Tells if the group can be edited be any member."
          }
        ]
      }
    },
    "filename": "./controllers/group.js"
  },
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "guest",
            "optional": false,
            "description": "Match guest team slug"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "host",
            "optional": false,
            "description": "Match host team slug"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "round",
            "optional": false,
            "description": "Match round"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Match date"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "field": "finished",
            "defaultValue": "false",
            "optional": true,
            "description": "Match status"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "elapsed",
            "optional": true,
            "description": "Match elapsed time"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "score.guest",
            "defaultValue": "0",
            "optional": true,
            "description": "Match guest team score"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "score.host",
            "defaultValue": "0",
            "optional": true,
            "description": "Match host team score"
          }
        ]
      }
    },
    "group": "match.js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./controllers/match.js"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Match identifier."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "round",
            "optional": false,
            "description": "Match round."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Match date."
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "finished",
            "optional": false,
            "description": "Match status."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "elapsed",
            "optional": false,
            "description": "Match elapsed time."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "winner",
            "optional": false,
            "description": "Match winner."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "jackpot",
            "optional": false,
            "description": "Match total pot."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "reward",
            "optional": false,
            "description": "Match reward."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "score": [
          {
            "group": "score",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest team score."
          },
          {
            "group": "score",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host team score."
          }
        ],
        "pot": [
          {
            "group": "pot",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest total bets."
          },
          {
            "group": "pot",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host total bets."
          },
          {
            "group": "pot",
            "type": "Number",
            "field": "draw",
            "optional": false,
            "description": "Match draw total bets."
          }
        ],
        "guest": [
          {
            "group": "guest",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Guest team name."
          },
          {
            "group": "guest",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Guest team picture."
          },
          {
            "group": "guest",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Guest team identifier."
          },
          {
            "group": "guest",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "guest",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "host": [
          {
            "group": "host",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Host team name."
          },
          {
            "group": "host",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Host team picture."
          },
          {
            "group": "host",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Host team identifier."
          },
          {
            "group": "host",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "host",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "group": "match.js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./controllers/match.js"
  },
  {
    "type": "post",
    "url": "/championships/:championship/matches",
    "title": "Creates a new match.",
    "name": "createMatch",
    "version": "2.0.1",
    "group": "match",
    "permission": "admin",
    "description": "Creates a new match.",
    "error": {
      "examples": [
        {
          "title": "    HTTP/1.1 400 Bad Request",
          "content": "   {\n     \"guest\" : \"required\",\n     \"host\" : \"required\",\n     \"round\" : \"required\",\n     \"date\" : \"required\"\n   }\n"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 201 Created",
          "content": "   {\n     \"slug\": \"brasilerao-brasil-2014-3-fluminense-vs-botafogo\"\n     \"guest\": {\n       \"name\": \"fluminense\",\n       \"slug\": \"fluminense\",\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"host\": {\n       \"name\": \"botafogo\",\n       \"slug\": \"botafogo\",\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"round\": 3,\n     \"date\": \"2014-07-01T12:22:25.058Z\",\n     \"finished\": true,\n     \"elapsed\": null,\n     \"score\": {\n       \"guest\": 0,\n       \"host\" 0\n     },\n     \"pot\": {\n       \"guest\": 0,\n       \"host\" 0,\n       \"draw\" 0\n     },\n     \"winner\": \"draw\",\n     \"jackpot\": 0,\n     \"reward\": 0,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Match identifier."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "round",
            "optional": false,
            "description": "Match round."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Match date."
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "finished",
            "optional": false,
            "description": "Match status."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "elapsed",
            "optional": false,
            "description": "Match elapsed time."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "winner",
            "optional": false,
            "description": "Match winner."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "jackpot",
            "optional": false,
            "description": "Match total pot."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "reward",
            "optional": false,
            "description": "Match reward."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "score": [
          {
            "group": "score",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest team score."
          },
          {
            "group": "score",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host team score."
          }
        ],
        "pot": [
          {
            "group": "pot",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest total bets."
          },
          {
            "group": "pot",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host total bets."
          },
          {
            "group": "pot",
            "type": "Number",
            "field": "draw",
            "optional": false,
            "description": "Match draw total bets."
          }
        ],
        "guest": [
          {
            "group": "guest",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Guest team name."
          },
          {
            "group": "guest",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Guest team picture."
          },
          {
            "group": "guest",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Guest team identifier."
          },
          {
            "group": "guest",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "guest",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "host": [
          {
            "group": "host",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Host team name."
          },
          {
            "group": "host",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Host team picture."
          },
          {
            "group": "host",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Host team identifier."
          },
          {
            "group": "host",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "host",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "guest",
            "optional": false,
            "description": "Match guest team slug"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "host",
            "optional": false,
            "description": "Match host team slug"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "round",
            "optional": false,
            "description": "Match round"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Match date"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "field": "finished",
            "defaultValue": "false",
            "optional": true,
            "description": "Match status"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "elapsed",
            "optional": true,
            "description": "Match elapsed time"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "score.guest",
            "defaultValue": "0",
            "optional": true,
            "description": "Match guest team score"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "score.host",
            "defaultValue": "0",
            "optional": true,
            "description": "Match host team score"
          }
        ]
      }
    },
    "filename": "./controllers/match.js"
  },
  {
    "type": "get",
    "url": "/championships/:championship/matches/:id",
    "title": "Get match info",
    "name": "getMatch",
    "version": "2.0.1",
    "group": "match",
    "permission": "user",
    "description": "Get match info.",
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"slug\": \"brasilerao-brasil-2014-3-fluminense-vs-botafogo\"\n     \"guest\": {\n       \"name\": \"fluminense\",\n       \"slug\": \"fluminense\",\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"host\": {\n       \"name\": \"botafogo\",\n       \"slug\": \"botafogo\",\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"round\": 3,\n     \"date\": \"2014-07-01T12:22:25.058Z\",\n     \"finished\": true,\n     \"elapsed\": null,\n     \"score\": {\n       \"guest\": 0,\n       \"host\" 0\n     },\n     \"pot\": {\n       \"guest\": 0,\n       \"host\" 0,\n       \"draw\" 0\n     },\n     \"winner\": \"draw\",\n     \"jackpot\": 0,\n     \"reward\": 0,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Match identifier."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "round",
            "optional": false,
            "description": "Match round."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Match date."
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "finished",
            "optional": false,
            "description": "Match status."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "elapsed",
            "optional": false,
            "description": "Match elapsed time."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "winner",
            "optional": false,
            "description": "Match winner."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "jackpot",
            "optional": false,
            "description": "Match total pot."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "reward",
            "optional": false,
            "description": "Match reward."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "score": [
          {
            "group": "score",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest team score."
          },
          {
            "group": "score",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host team score."
          }
        ],
        "pot": [
          {
            "group": "pot",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest total bets."
          },
          {
            "group": "pot",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host total bets."
          },
          {
            "group": "pot",
            "type": "Number",
            "field": "draw",
            "optional": false,
            "description": "Match draw total bets."
          }
        ],
        "guest": [
          {
            "group": "guest",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Guest team name."
          },
          {
            "group": "guest",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Guest team picture."
          },
          {
            "group": "guest",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Guest team identifier."
          },
          {
            "group": "guest",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "guest",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "host": [
          {
            "group": "host",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Host team name."
          },
          {
            "group": "host",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Host team picture."
          },
          {
            "group": "host",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Host team identifier."
          },
          {
            "group": "host",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "host",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "filename": "./controllers/match.js"
  },
  {
    "type": "get",
    "url": "/championships/:championship/matches",
    "title": "List all matches",
    "name": "listMatch",
    "version": "2.0.1",
    "group": "match",
    "permission": "user",
    "description": "List all matches.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "page",
            "defaultValue": "0",
            "optional": true,
            "description": "The page to be displayed."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   [{\n     \"slug\": \"brasilerao-brasil-2014-3-fluminense-vs-botafogo\"\n     \"guest\": {\n       \"name\": \"fluminense\",\n       \"slug\": \"fluminense\",\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"host\": {\n       \"name\": \"botafogo\",\n       \"slug\": \"botafogo\",\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"round\": 3,\n     \"date\": \"2014-07-01T12:22:25.058Z\",\n     \"finished\": true,\n     \"elapsed\": null,\n     \"score\": {\n       \"guest\": 0,\n       \"host\" 0\n     },\n     \"pot\": {\n       \"guest\": 0,\n       \"host\" 0,\n       \"draw\" 0\n     },\n     \"winner\": \"draw\",\n     \"jackpot\": 0,\n     \"reward\": 0,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }]\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Match identifier."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "round",
            "optional": false,
            "description": "Match round."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Match date."
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "finished",
            "optional": false,
            "description": "Match status."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "elapsed",
            "optional": false,
            "description": "Match elapsed time."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "winner",
            "optional": false,
            "description": "Match winner."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "jackpot",
            "optional": false,
            "description": "Match total pot."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "reward",
            "optional": false,
            "description": "Match reward."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "score": [
          {
            "group": "score",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest team score."
          },
          {
            "group": "score",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host team score."
          }
        ],
        "pot": [
          {
            "group": "pot",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest total bets."
          },
          {
            "group": "pot",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host total bets."
          },
          {
            "group": "pot",
            "type": "Number",
            "field": "draw",
            "optional": false,
            "description": "Match draw total bets."
          }
        ],
        "guest": [
          {
            "group": "guest",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Guest team name."
          },
          {
            "group": "guest",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Guest team picture."
          },
          {
            "group": "guest",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Guest team identifier."
          },
          {
            "group": "guest",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "guest",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "host": [
          {
            "group": "host",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Host team name."
          },
          {
            "group": "host",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Host team picture."
          },
          {
            "group": "host",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Host team identifier."
          },
          {
            "group": "host",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "host",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "filename": "./controllers/match.js"
  },
  {
    "type": "delete",
    "url": "/championships/:championship/matches/:id",
    "title": "Removes match",
    "name": "removeMatch",
    "version": "2.0.1",
    "group": "match",
    "permission": "admin",
    "description": "Removes match",
    "filename": "./controllers/match.js"
  },
  {
    "type": "put",
    "url": "/championships/:championship/matches/:id",
    "title": "Updates match info",
    "name": "updateMatch",
    "version": "2.0.1",
    "group": "match",
    "permission": "admin",
    "description": "Updates match info.",
    "error": {
      "examples": [
        {
          "title": "    HTTP/1.1 400 Bad Request",
          "content": "   {\n     \"guest\" : \"required\",\n     \"host\" : \"required\",\n     \"round\" : \"required\",\n     \"date\" : \"required\"\n   }\n"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"slug\": \"brasilerao-brasil-2014-3-fluminense-vs-botafogo\"\n     \"guest\": {\n       \"name\": \"fluminense\",\n       \"slug\": \"fluminense\",\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"host\": {\n       \"name\": \"botafogo\",\n       \"slug\": \"botafogo\",\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"round\": 3,\n     \"date\": \"2014-07-01T12:22:25.058Z\",\n     \"finished\": true,\n     \"elapsed\": null,\n     \"score\": {\n       \"guest\": 0,\n       \"host\" 0\n     },\n     \"pot\": {\n       \"guest\": 0,\n       \"host\" 0,\n       \"draw\" 0\n     },\n     \"winner\": \"draw\",\n     \"jackpot\": 0,\n     \"reward\": 0,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Match identifier."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "round",
            "optional": false,
            "description": "Match round."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Match date."
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "finished",
            "optional": false,
            "description": "Match status."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "elapsed",
            "optional": false,
            "description": "Match elapsed time."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "winner",
            "optional": false,
            "description": "Match winner."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "jackpot",
            "optional": false,
            "description": "Match total pot."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "reward",
            "optional": false,
            "description": "Match reward."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "score": [
          {
            "group": "score",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest team score."
          },
          {
            "group": "score",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host team score."
          }
        ],
        "pot": [
          {
            "group": "pot",
            "type": "Number",
            "field": "guest",
            "optional": false,
            "description": "Match guest total bets."
          },
          {
            "group": "pot",
            "type": "Number",
            "field": "host",
            "optional": false,
            "description": "Match host total bets."
          },
          {
            "group": "pot",
            "type": "Number",
            "field": "draw",
            "optional": false,
            "description": "Match draw total bets."
          }
        ],
        "guest": [
          {
            "group": "guest",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Guest team name."
          },
          {
            "group": "guest",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Guest team picture."
          },
          {
            "group": "guest",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Guest team identifier."
          },
          {
            "group": "guest",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "guest",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "host": [
          {
            "group": "host",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Host team name."
          },
          {
            "group": "host",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Host team picture."
          },
          {
            "group": "host",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Host team identifier."
          },
          {
            "group": "host",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "host",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "guest",
            "optional": false,
            "description": "Match guest team slug"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "host",
            "optional": false,
            "description": "Match host team slug"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "round",
            "optional": false,
            "description": "Match round"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Match date"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "field": "finished",
            "defaultValue": "false",
            "optional": true,
            "description": "Match status"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "elapsed",
            "optional": true,
            "description": "Match elapsed time"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "score.guest",
            "defaultValue": "0",
            "optional": true,
            "description": "Match guest team score"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "field": "score.host",
            "defaultValue": "0",
            "optional": true,
            "description": "Match host team score"
          }
        ]
      }
    },
    "filename": "./controllers/match.js"
  },
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "field": "name",
            "optional": false,
            "description": "Team name"
          },
          {
            "group": "Parameter",
            "type": "string",
            "field": "picture",
            "optional": true,
            "description": "Team picture"
          }
        ]
      }
    },
    "group": "team.js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./controllers/team.js"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Team name."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Team picture."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Team identifier."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "group": "team.js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./controllers/team.js"
  },
  {
    "type": "post",
    "url": "/teams",
    "title": "Creates a new team.",
    "name": "createTeam",
    "version": "2.0.1",
    "group": "team",
    "permission": "admin",
    "description": "Creates a new team.",
    "error": {
      "examples": [
        {
          "title": "    HTTP/1.1 400 Bad Request",
          "content": "   {\n     \"name\": \"required\",\n     \"picture\": \"required\"\n   }\n"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 201 Created",
          "content": "   {\n     \"name\": \"santos fc\",\n     \"slug\": \"santos-fc\",\n     \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n     \"slug\": \"53b2a7f0fea3f69192122f38\",\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Team name."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Team picture."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Team identifier."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "field": "name",
            "optional": false,
            "description": "Team name"
          },
          {
            "group": "Parameter",
            "type": "string",
            "field": "picture",
            "optional": true,
            "description": "Team picture"
          }
        ]
      }
    },
    "filename": "./controllers/team.js"
  },
  {
    "type": "get",
    "url": "/teams/:id",
    "title": "Get team info",
    "name": "getTeam",
    "version": "2.0.1",
    "group": "team",
    "permission": "user",
    "description": "Get team info.",
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"name\": \"santos fc\",\n     \"slug\": \"santos-fc\",\n     \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Team name."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Team picture."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Team identifier."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "filename": "./controllers/team.js"
  },
  {
    "type": "get",
    "url": "/teams",
    "title": "List all teams",
    "name": "listTeam",
    "version": "2.0.1",
    "group": "team",
    "permission": "user",
    "description": "List all teams.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "page",
            "defaultValue": "0",
            "optional": true,
            "description": "The page to be displayed."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   [{\n     \"name\": \"santos fc\",\n     \"slug\": \"santos-fc\",\n     \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }]\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Team name."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Team picture."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Team identifier."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "filename": "./controllers/team.js"
  },
  {
    "type": "delete",
    "url": "/teams/:id",
    "title": "Removes team",
    "name": "removeTeam",
    "version": "2.0.1",
    "group": "team",
    "permission": "admin",
    "description": "Removes team",
    "filename": "./controllers/team.js"
  },
  {
    "type": "put",
    "url": "/teams/:id",
    "title": "Updates team info",
    "name": "updateTeam",
    "version": "2.0.1",
    "group": "team",
    "permission": "admin",
    "description": "Updates team info.",
    "error": {
      "examples": [
        {
          "title": "    HTTP/1.1 400 Bad Request",
          "content": "   {\n     \"name\": \"required\",\n     \"picture\": \"required\"\n   }\n"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"name\": \"santos fc\",\n     \"slug\": \"santos-fc\",\n     \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "Team name."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "Team picture."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "Team identifier."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "field": "name",
            "optional": false,
            "description": "Team name"
          },
          {
            "group": "Parameter",
            "type": "string",
            "field": "picture",
            "optional": true,
            "description": "Team picture"
          }
        ]
      }
    },
    "filename": "./controllers/team.js"
  },
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "email",
            "optional": true,
            "description": "User email"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "username",
            "optional": true,
            "description": "User username"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "password",
            "optional": false,
            "description": "User password"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": true,
            "description": "User name"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "about",
            "optional": true,
            "description": "User about"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "picture",
            "optional": true,
            "description": "User picture"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "apnsToken",
            "optional": true,
            "description": "User apnsToken"
          }
        ]
      }
    },
    "group": "user.js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./controllers/user.js"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ]
      }
    },
    "group": "user.js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./controllers/user.js"
  },
  {
    "type": "get",
    "url": "/users/:id/auth",
    "title": "Get user access token",
    "name": "authUser",
    "version": "2.0.1",
    "group": "user",
    "permission": "none",
    "description": "Get user info.",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "token",
            "optional": false,
            "description": "User access token"
          }
        ]
      },
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"token\": \"asdpsfhysdofwe3456sdfsd\",\n   }\n"
        }
      ]
    },
    "filename": "./controllers/user.js"
  },
  {
    "type": "post",
    "url": "/users",
    "title": "Creates a new user.",
    "name": "createUser",
    "version": "2.0.1",
    "group": "user",
    "permission": "none",
    "description": "Creates a new user.",
    "error": {
      "examples": [
        {
          "title": "    HTTP/1.1 400 Bad Request",
          "content": "   {\n     \"password\": \"required\"\n   }\n"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 201 Created",
          "content": "   {\n     \"slug\": \"vandoren\",\n     \"email\": \"vandoren@vandoren.com\",\n     \"username\": \"vandoren\",\n     \"name\": \"Van Doren\",\n     \"about\": \"footbl fan\",\n     \"verified\": false,\n     \"featured\": false,\n     \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n     \"ranking\": \"2\",\n     \"previousRanking\": \"1\",\n     \"history\": [{\n       \"date\": \"2014-07-01T12:22:25.058Z\",\n       \"funds\": 100\n     },{\n       \"date\": \"2014-07-03T12:22:25.058Z\",\n       \"funds\": 120\n     }],\n     \"funds\": 100,\n     \"stake\": 0,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "email",
            "optional": true,
            "description": "User email"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "username",
            "optional": true,
            "description": "User username"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "password",
            "optional": false,
            "description": "User password"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": true,
            "description": "User name"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "about",
            "optional": true,
            "description": "User about"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "picture",
            "optional": true,
            "description": "User picture"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "apnsToken",
            "optional": true,
            "description": "User apnsToken"
          }
        ]
      }
    },
    "filename": "./controllers/user.js"
  },
  {
    "type": "get",
    "url": "/users/:id",
    "title": "Get user info",
    "name": "getUser",
    "version": "2.0.1",
    "group": "user",
    "permission": "user",
    "description": "Get user info.",
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"slug\": \"vandoren\",\n     \"email\": \"vandoren@vandoren.com\",\n     \"username\": \"vandoren\",\n     \"name\": \"Van Doren\",\n     \"about\": \"footbl fan\",\n     \"verified\": false,\n     \"featured\": false,\n     \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n     \"ranking\": \"2\",\n     \"previousRanking\": \"1\",\n     \"history\": [{\n       \"date\": \"2014-07-01T12:22:25.058Z\",\n       \"funds\": 100\n     },{\n       \"date\": \"2014-07-03T12:22:25.058Z\",\n       \"funds\": 120\n     }],\n     \"funds\": 100,\n     \"stake\": 0,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ]
      }
    },
    "filename": "./controllers/user.js"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "List all users",
    "name": "listUser",
    "version": "2.0.1",
    "group": "user",
    "permission": "none",
    "description": "List all users.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "page",
            "defaultValue": "0",
            "optional": true,
            "description": "The page to be displayed."
          },
          {
            "group": "Parameter",
            "type": "Array",
            "field": "emails",
            "optional": true,
            "description": "Emails to search."
          },
          {
            "group": "Parameter",
            "type": "Array",
            "field": "usernames",
            "optional": true,
            "description": "Usernames to search."
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   [{\n     \"slug\": \"vandoren\",\n     \"email\": \"vandoren@vandoren.com\",\n     \"username\": \"vandoren\",\n     \"name\": \"Van Doren\",\n     \"about\": \"footbl fan\",\n     \"verified\": false,\n     \"featured\": false,\n     \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n     \"ranking\": \"2\",\n     \"previousRanking\": \"1\",\n     \"history\": [{\n       \"date\": \"2014-07-01T12:22:25.058Z\",\n       \"funds\": 100\n     },{\n       \"date\": \"2014-07-03T12:22:25.058Z\",\n       \"funds\": 120\n     }],\n     \"funds\": 100,\n     \"stake\": 0,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }]\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ]
      }
    },
    "filename": "./controllers/user.js"
  },
  {
    "type": "delete",
    "url": "/users/:id",
    "title": "Removes user",
    "name": "removeUser",
    "version": "2.0.1",
    "group": "user",
    "permission": "user",
    "description": "Removes user",
    "filename": "./controllers/user.js"
  },
  {
    "type": "put",
    "url": "/users/:id",
    "title": "Updates user info",
    "name": "updateUser",
    "version": "2.0.1",
    "group": "user",
    "permission": "user",
    "description": "Updates user info.",
    "error": {
      "examples": [
        {
          "title": "    HTTP/1.1 400 Bad Request",
          "content": "   {\n     \"password\": \"required\"\n   }\n"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"slug\": \"vandoren\",\n     \"email\": \"vandoren@vandoren.com\",\n     \"username\": \"vandoren\",\n     \"name\": \"Van Doren\",\n     \"about\": \"footbl fan\",\n     \"verified\": false,\n     \"featured\": false,\n     \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n     \"ranking\": \"2\",\n     \"previousRanking\": \"1\",\n     \"history\": [{\n       \"date\": \"2014-07-01T12:22:25.058Z\",\n       \"funds\": 100\n     },{\n       \"date\": \"2014-07-03T12:22:25.058Z\",\n       \"funds\": 120\n     }],\n     \"funds\": 100,\n     \"stake\": 0,\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "field": "slug",
            "optional": false,
            "description": "User identifier"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "email",
            "optional": false,
            "description": "User email"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "username",
            "optional": false,
            "description": "User username"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "User name"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "about",
            "optional": false,
            "description": "User about"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "verified",
            "optional": false,
            "description": "User verified"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "field": "featured",
            "optional": false,
            "description": "User featured"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "picture",
            "optional": false,
            "description": "User picture"
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "apnsToken",
            "optional": false,
            "description": "User apnsToken"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "ranking",
            "optional": false,
            "description": "User current ranking"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "previousRanking",
            "optional": false,
            "description": "User previous ranking"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "User funds"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "stake",
            "optional": false,
            "description": "User stake"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "createdAt",
            "optional": false,
            "description": "Date of document creation."
          },
          {
            "group": "Success 200",
            "type": "Date",
            "field": "updatedAt",
            "optional": false,
            "description": "Date of document last change."
          }
        ],
        "history": [
          {
            "group": "history",
            "type": "Date",
            "field": "date",
            "optional": false,
            "description": "Date of history creation"
          },
          {
            "group": "history",
            "type": "Number",
            "field": "funds",
            "optional": false,
            "description": "Funds in history"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "email",
            "optional": true,
            "description": "User email"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "username",
            "optional": true,
            "description": "User username"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "password",
            "optional": false,
            "description": "User password"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": true,
            "description": "User name"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "about",
            "optional": true,
            "description": "User about"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "picture",
            "optional": true,
            "description": "User picture"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "apnsToken",
            "optional": true,
            "description": "User apnsToken"
          }
        ]
      }
    },
    "filename": "./controllers/user.js"
  }
] });