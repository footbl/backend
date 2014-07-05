define({ api: [
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
    "title": "Creates a new championship in database.",
    "name": "createChampionship",
    "version": "2.0.1",
    "group": "championship",
    "permission": "admin",
    "description": "Creates a new championship in database. To create a new championship, the client must provide a name, picture,\nedition, type and country. The the properties name, edition are required, and the default value for the type is\nnational league.",
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
    "title": "Get championship info in database",
    "name": "getChampionship",
    "version": "2.0.1",
    "group": "championship",
    "permission": "user",
    "description": "Get championship info in database.",
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
    "title": "List all championships in database",
    "name": "listChampionship",
    "version": "2.0.1",
    "group": "championship",
    "permission": "user",
    "description": "List all championships in database.",
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
    "title": "Removes championship from database",
    "name": "removeChampionship",
    "version": "2.0.1",
    "group": "championship",
    "permission": "admin",
    "description": "Removes championship from database",
    "filename": "./controllers/championship.js"
  },
  {
    "type": "put",
    "url": "/championships/:id",
    "title": "Updates championship info in database",
    "name": "updateChampionship",
    "version": "2.0.1",
    "group": "championship",
    "permission": "admin",
    "description": "Updates championship info in database.",
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
    "url": "/groups",
    "title": "Creates a new group in database.",
    "name": "createGroup",
    "version": "2.0.1",
    "group": "group",
    "permission": "user",
    "description": "Creates a new group in database.",
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
    "title": "Get group info in database",
    "name": "getGroup",
    "version": "2.0.1",
    "group": "group",
    "permission": "user",
    "description": "Get group info in database.",
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
    "type": "get",
    "url": "/groups",
    "title": "List all groups in database",
    "name": "listGroup",
    "version": "2.0.1",
    "group": "group",
    "permission": "user",
    "description": "List all groups in database.",
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
    "title": "Removes group from database",
    "name": "removeGroup",
    "version": "2.0.1",
    "group": "group",
    "permission": "user",
    "description": "Removes group from database",
    "filename": "./controllers/group.js"
  },
  {
    "type": "put",
    "url": "/groups/:id",
    "title": "Updates group info in database",
    "name": "updateGroup",
    "version": "2.0.1",
    "group": "group",
    "permission": "user",
    "description": "Updates group info in database.",
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
            "type": "String",
            "field": "guest",
            "optional": false,
            "description": "Match guest team slug."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "host",
            "optional": false,
            "description": "Match host team slug."
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
            "type": "Number",
            "field": "score.guest",
            "optional": false,
            "description": "Match guest team score."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "score.host",
            "optional": false,
            "description": "Match host team score."
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
    "group": "match.js",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./controllers/match.js"
  },
  {
    "type": "post",
    "url": "/championships/:championship/matches",
    "title": "Creates a new match in database.",
    "name": "createMatch",
    "version": "2.0.1",
    "group": "match",
    "permission": "admin",
    "description": "Creates a new match in database.",
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
          "content": "   {\n     \"slug\": \"brasilerao-brasil-2014-3-fluminense-vs-botafogo\"\n     \"guest\": {\n       \"name\": \"fluminense\",\n       \"slug\": \"fluminense\",\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"host\": {\n       \"name\": \"botafogo\",\n       \"slug\": \"botafogo\",\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"round\": 3,\n     \"date\": \"2014-07-01T12:22:25.058Z\",\n     \"finished\": true,\n     \"elapsed\": null,\n     \"score\": {\n       \"guest\": 0,\n       \"host\" 0\n     },\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
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
            "type": "String",
            "field": "guest",
            "optional": false,
            "description": "Match guest team slug."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "host",
            "optional": false,
            "description": "Match host team slug."
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
            "type": "Number",
            "field": "score.guest",
            "optional": false,
            "description": "Match guest team score."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "score.host",
            "optional": false,
            "description": "Match host team score."
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
    "title": "Get match info in database",
    "name": "getMatch",
    "version": "2.0.1",
    "group": "match",
    "permission": "user",
    "description": "Get match info in database.",
    "success": {
      "examples": [
        {
          "title": "    HTTP/1.1 200 Ok",
          "content": "   {\n     \"slug\": \"brasilerao-brasil-2014-3-fluminense-vs-botafogo\"\n     \"guest\": {\n       \"name\": \"fluminense\",\n       \"slug\": \"fluminense\",\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"host\": {\n       \"name\": \"botafogo\",\n       \"slug\": \"botafogo\",\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"round\": 3,\n     \"date\": \"2014-07-01T12:22:25.058Z\",\n     \"finished\": true,\n     \"elapsed\": null,\n     \"score\": {\n       \"guest\": 0,\n       \"host\" 0\n     },\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
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
            "type": "String",
            "field": "guest",
            "optional": false,
            "description": "Match guest team slug."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "host",
            "optional": false,
            "description": "Match host team slug."
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
            "type": "Number",
            "field": "score.guest",
            "optional": false,
            "description": "Match guest team score."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "score.host",
            "optional": false,
            "description": "Match host team score."
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
    "filename": "./controllers/match.js"
  },
  {
    "type": "get",
    "url": "/championships/:championship/matches",
    "title": "List all matches in database",
    "name": "listMatch",
    "version": "2.0.1",
    "group": "match",
    "permission": "user",
    "description": "List all matches in database.",
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
          "content": "   [{\n     \"slug\": \"brasilerao-brasil-2014-3-fluminense-vs-botafogo\"\n     \"guest\": {\n       \"name\": \"fluminense\",\n       \"slug\": \"fluminense\",\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"host\": {\n       \"name\": \"botafogo\",\n       \"slug\": \"botafogo\",\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"round\": 3,\n     \"date\": \"2014-07-01T12:22:25.058Z\",\n     \"finished\": true,\n     \"elapsed\": null,\n     \"score\": {\n       \"guest\": 0,\n       \"host\" 0\n     },\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }]\n"
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
            "type": "String",
            "field": "guest",
            "optional": false,
            "description": "Match guest team slug."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "host",
            "optional": false,
            "description": "Match host team slug."
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
            "type": "Number",
            "field": "score.guest",
            "optional": false,
            "description": "Match guest team score."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "score.host",
            "optional": false,
            "description": "Match host team score."
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
    "filename": "./controllers/match.js"
  },
  {
    "type": "delete",
    "url": "/championships/:championship/matches/:id",
    "title": "Removes match from database",
    "name": "removeMatch",
    "version": "2.0.1",
    "group": "match",
    "permission": "admin",
    "description": "Removes match from database",
    "filename": "./controllers/match.js"
  },
  {
    "type": "put",
    "url": "/championships/:championship/matches/:id",
    "title": "Updates match info in database",
    "name": "updateMatch",
    "version": "2.0.1",
    "group": "match",
    "permission": "admin",
    "description": "Updates match info in database.",
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
          "content": "   {\n     \"slug\": \"brasilerao-brasil-2014-3-fluminense-vs-botafogo\"\n     \"guest\": {\n       \"name\": \"fluminense\",\n       \"slug\": \"fluminense\",\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"host\": {\n       \"name\": \"botafogo\",\n       \"slug\": \"botafogo\",\n       \"picture\": \"http://res.cloudinary.com/hivstsgwo/image/upload/v1403968689/world_icon_2x_frtfue.png\",\n       \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n       \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n     },\n     \"round\": 3,\n     \"date\": \"2014-07-01T12:22:25.058Z\",\n     \"finished\": true,\n     \"elapsed\": null,\n     \"score\": {\n       \"guest\": 0,\n       \"host\" 0\n     },\n     \"createdAt\": \"2014-07-01T12:22:25.058Z\",\n     \"updatedAt\": \"2014-07-01T12:22:25.058Z\"\n   }\n"
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
            "type": "String",
            "field": "guest",
            "optional": false,
            "description": "Match guest team slug."
          },
          {
            "group": "Success 200",
            "type": "String",
            "field": "host",
            "optional": false,
            "description": "Match host team slug."
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
            "type": "Number",
            "field": "score.guest",
            "optional": false,
            "description": "Match guest team score."
          },
          {
            "group": "Success 200",
            "type": "Number",
            "field": "score.host",
            "optional": false,
            "description": "Match host team score."
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
    "title": "Creates a new team in database.",
    "name": "createTeam",
    "version": "2.0.1",
    "group": "team",
    "permission": "admin",
    "description": "Creates a new team in database.",
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
    "title": "Get team info in database",
    "name": "getTeam",
    "version": "2.0.1",
    "group": "team",
    "permission": "user",
    "description": "Get team info in database.",
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
    "title": "List all teams in database",
    "name": "listTeam",
    "version": "2.0.1",
    "group": "team",
    "permission": "user",
    "description": "List all teams in database.",
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
    "title": "Removes team from database",
    "name": "removeTeam",
    "version": "2.0.1",
    "group": "team",
    "permission": "admin",
    "description": "Removes team from database",
    "filename": "./controllers/team.js"
  },
  {
    "type": "put",
    "url": "/teams/:id",
    "title": "Updates team info in database",
    "name": "updateTeam",
    "version": "2.0.1",
    "group": "team",
    "permission": "admin",
    "description": "Updates team info in database.",
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
  }
] });