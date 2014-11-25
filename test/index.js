var now, nock;
now = new Date();
nock = require('nock');

nock('https://graph.facebook.com').get('/me?access_token=1234').times(Infinity).reply(200, {'id' : '111'});
nock('https://graph.facebook.com').get('/me?access_token=invalid').times(Infinity).reply(404, {});
nock('https://mandrillapp.com').post('/api/1.0/messages/send.json').times(Infinity).reply(200, {});
nock('http://freegeoip.net').get('/json/127.0.0.1').times(Infinity).reply(200, {'country_name' : 'Brazil'});
nock('http://freegeoip.net').get('/json/undefined').times(Infinity).reply(200, {'country_name' : ''});
nock('https://api.zeropush.com').post('/notify').times(Infinity).reply(200, {'message' : 'authenticated'});
nock('https://api.zeropush.com').post('/register').times(Infinity).reply(200, {'message' : 'authenticated'});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=1').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=2').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=3').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=4').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=5').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=11').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=10').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=18').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=19').times(Infinity).reply(200, {Games : []});
nock('http://ws.365scores.com').get('/?action=1&Sid=1&curr_season=true&CountryID=21').times(Infinity).reply(200, {
  "LastUpdateID"      : 77721894,
  "Games"             : [
    {
      "SID"     : 1,
      "ID"      : 547094,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "13-08-2014 00:00",
      "Comps"   : [
        {
          "ID"   : 1221,
          "Name" : "Nautico Recife",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1227,
          "Name" : "Vasco Da Gama",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 5,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 571053,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "13-08-2014 00:00",
      "Comps"   : [
        {
          "ID"   : 1777,
          "Name" : "Avai",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 8514,
          "Name" : "América Mineiro",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 16,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 571054,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "12-08-2014 22:30",
      "Comps"   : [
        {
          "ID"   : 1776,
          "Name" : "ABC",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1223,
          "Name" : "Portuguesa",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 16,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514102,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "12-08-2014 00:30",
      "Comps"   : [
        {
          "ID"   : 1784,
          "Name" : "CRB",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 7386,
          "Name" : "ASA AL",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 10,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 575273,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 22:00",
      "Comps"   : [
        {
          "ID"   : 20787,
          "Name" : "Rio Branco/Ac",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 12750,
          "Name" : "Genus (RO)",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513406,
      "Comp"    : 113,
      "Season"  : 7,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear() + " 21:30",
      "Comps"   : [
        {
          "ID"   : 1209,
          "Name" : "Atletico Mineiro",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1222,
          "Name" : "Palmeiras",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513410,
      "Comp"    : 113,
      "Season"  : 7,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 21:30",
      "Comps"   : [
        {
          "ID"   : 7387,
          "Name" : "Chapecoense",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1214,
          "Name" : "Figueirense",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513415,
      "Comp"    : 113,
      "Season"  : 7,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 21:30",
      "Comps"   : [
        {
          "ID"   : 1225,
          "Name" : "Sao Paulo",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1228,
          "Name" : "Vitoria",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513407,
      "Comp"    : 113,
      "Season"  : 7,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"    : 1210,
          "Name"  : "Atletico Paranaense",
          "SName" : "Paranaense",
          "CID"   : 21,
          "SID"   : 1
        },
        {
          "ID"   : 1211,
          "Name" : "Botafogo",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513411,
      "Comp"    : 113,
      "Season"  : 7,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 1215,
          "Name" : "Flamengo",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1226,
          "Name" : "Sport Recife",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513413,
      "Comp"    : 113,
      "Season"  : 7,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 1219,
          "Name" : "Internacional",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1218,
          "Name" : "Gremio",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513414,
      "Comp"    : 113,
      "Season"  : 7,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 1224,
          "Name" : "Santos",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1267,
          "Name" : "Corinthians",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514100,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 10265,
          "Name" : "Águia de Marabá",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 7390,
          "Name" : "Paysandu",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 10,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514104,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 1276,
          "Name" : "Guarani",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1275,
          "Name" : "Sao Caetano",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 10,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514108,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 1775,
          "Name" : "Juventude",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"    : 9083,
          "Name"  : "Caxias do Sul",
          "SName" : "Caxias",
          "CID"   : 21,
          "SID"   : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 10,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 575148,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 19541,
          "Name" : "Princesa/Am",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 10322,
          "Name" : "Atletico/AC",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 575149,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 7300,
          "Name" : "Sao Raimundo",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 19818,
          "Name" : "Santos Macapá/AP",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 575150,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 20784,
          "Name" : "River/Pi",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 18778,
          "Name" : "Moto Clube/Ma",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 575151,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 9179,
          "Name" : "Guarany (CE)",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 19179,
          "Name" : "Interporto FC/To",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 575152,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 9166,
          "Name" : "Central",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 19555,
          "Name" : "Coruripe/Al",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 575153,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 5917,
          "Name" : "Campinese",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 19001,
          "Name" : "Baraúnas/Rn",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 575154,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 11618,
          "Name" : "Betim EC (MG)",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9164,
          "Name" : "Porto PE",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 575155,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 19000,
          "Name" : "Globo Fc/Rn",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9210,
          "Name" : "Confianca",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 575156,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 19520,
          "Name" : "Brasiliense",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 20785,
          "Name" : "Itaporã/Ms",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 575157,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 9109,
          "Name" : "Operario",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 11699,
          "Name" : "Luziânia/DF",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 575158,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 10248,
          "Name" : "Tombense",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 19571,
          "Name" : "Grêmio Barueri/Sp",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 575159,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 18884,
          "Name" : "Maringá Fc/Pr",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 17055,
          "Name" : "Cabofriense",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 575160,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 10273,
          "Name" : "SERC Guarani",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1271,
          "Name" : "Ituano",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 575161,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 20781,
          "Name" : "Boavista/Rj",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9113,
          "Name" : "Londrina",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513412,
      "Comp"    : 113,
      "Season"  : 7,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 00:00",
      "Comps"   : [
        {
          "ID"   : 1216,
          "Name" : "Fluminense",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1212,
          "Name" : "Coritiba",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513789,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 00:00",
      "Comps"   : [
        {
          "ID"   : 10247,
          "Name" : "Boa Esporte",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1783,
          "Name" : "América (RN)",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 15,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513791,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "10-08-2014 00:00",
      "Comps"   : [
        {
          "ID"   : 1772,
          "Name" : "Oeste",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1777,
          "Name" : "Avai",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 15,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514418,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "09-08-2014 22:00",
      "Comps"   : [
        {
          "ID"   : 7291,
          "Name" : "Treze PB",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9203,
          "Name" : "Botafogo (PB)",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 10,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513408,
      "Comp"    : 113,
      "Season"  : 7,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "09-08-2014 21:30",
      "Comps"   : [
        {
          "ID"   : 1767,
          "Name" : "Bahia",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1217,
          "Name" : "Goias",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513409,
      "Comp"    : 113,
      "Season"  : 7,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "09-08-2014 21:30",
      "Comps"   : [
        {
          "ID"   : 1780,
          "Name" : "Criciuma",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1213,
          "Name" : "Cruzeiro",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 519187,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "09-08-2014 21:00",
      "Comps"   : [
        {
          "ID"   : 9173,
          "Name" : "CRAC GO",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9188,
          "Name" : "Cuiaba",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 10,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513786,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "09-08-2014 19:20",
      "Comps"   : [
        {
          "ID"   : 1776,
          "Name" : "ABC",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1227,
          "Name" : "Vasco Da Gama",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 15,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513794,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "09-08-2014 19:20",
      "Comps"   : [
        {
          "ID"   : 1787,
          "Name" : "Parana",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1782,
          "Name" : "Vila Nova",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 15,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 547095,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "09-08-2014 19:20",
      "Comps"   : [
        {
          "ID"   : 14154,
          "Name" : "Santa Cruz (PE)",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1221,
          "Name" : "Nautico Recife",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 15,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514103,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "09-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 7073,
          "Name" : "Duque de Caxias",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 7063,
          "Name" : "Madureira",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 10,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514105,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "09-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 1778,
          "Name" : "Fortaleza",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 8394,
          "Name" : "Salgueiro",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 10,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514107,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "09-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 7064,
          "Name" : "Macae",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9104,
          "Name" : "Tupi",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 10,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 570750,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "09-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 10274,
          "Name" : "Estrela do Norte",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9107,
          "Name" : "Villa Nova AC",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 570751,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "09-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 10190,
          "Name" : "CA Penapolense",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9148,
          "Name" : "Metropolitano",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514106,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "09-08-2014 18:00",
      "Comps"   : [
        {
          "ID"   : 1265,
          "Name" : "Guaratingueta",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1771,
          "Name" : "Mogi Mirim",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 10,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513795,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "09-08-2014 00:00",
      "Comps"   : [
        {
          "ID"   : 1266,
          "Name" : "Ponte Preta",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1273,
          "Name" : "Bragantino",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 15,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513788,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "08-08-2014 22:30",
      "Comps"   : [
        {
          "ID"    : 5918,
          "Name"  : "Atletico Goianiense",
          "SName" : "Goianiense",
          "CID"   : 21,
          "SID"   : 1
        },
        {
          "ID"   : 1781,
          "Name" : "Ceara",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 15,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513790,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "08-08-2014 22:30",
      "Comps"   : [
        {
          "ID"   : 7552,
          "Name" : "Icasa CE",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 8514,
          "Name" : "América Mineiro",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 15,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 575868,
      "Comp"    : 5518,
      "Season"  : 2,
      "Stage"   : 1,
      "Group"   : 2,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "08-08-2014 00:00",
      "Comps"   : [
        {
          "ID"   : 1775,
          "Name" : "Juventude",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"    : 9083,
          "Name"  : "Caxias do Sul",
          "SName" : "Caxias",
          "CID"   : 21,
          "SID"   : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 10,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546682,
      "Comp"    : 115,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "07-08-2014 01:00",
      "Comps"   : [
        {
          "ID"   : 1783,
          "Name" : "América (RN)",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1216,
          "Name" : "Fluminense",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546683,
      "Comp"    : 115,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "07-08-2014 01:00",
      "Comps"   : [
        {
          "ID"   : 1767,
          "Name" : "Bahia",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1267,
          "Name" : "Corinthians",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546684,
      "Comp"    : 115,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "07-08-2014 01:00",
      "Comps"   : [
        {
          "ID"   : 7390,
          "Name" : "Paysandu",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1212,
          "Name" : "Coritiba",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546685,
      "Comp"    : 115,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "07-08-2014 01:00",
      "Comps"   : [
        {
          "ID"   : 19554,
          "Name" : "Santa Rita (AL)",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 14154,
          "Name" : "Santa Cruz (PE)",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546680,
      "Comp"    : 113,
      "Season"  : 7,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "07-08-2014 00:00",
      "Comps"   : [
        {
          "ID"   : 7387,
          "Name" : "Chapecoense",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1209,
          "Name" : "Atletico Mineiro",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 10,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546725,
      "Comp"    : 115,
      "Active"  : false,
      "STID"    : 2,
      "GT"      : -1,
      "STime"   : "06-08-2014 22:30",
      "Comps"   : [
        {
          "ID"   : 1222,
          "Name" : "Palmeiras",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1777,
          "Name" : "Avai",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546758,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "06-08-2014 00:00",
      "Comps"   : [
        {
          "ID"   : 9147,
          "Name" : "Joinville",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 7301,
          "Name" : "Sampaio Correa (MA)",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        3,
        1,
        2,
        1,
        3,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 15,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 22,
          "Player" : "Marcelo Costa"
        },
        {
          "Type"   : 0,
          "SType"  : 2,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 27,
          "Player" : "William Paulista"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 38,
          "Player" : "Fabinho"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 1,
          "GT"     : 77,
          "Player" : "Jael"
        },
        {
          "Type"   : 2,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 63,
          "Player" : "William Paulista"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546759,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "05-08-2014 22:30",
      "Comps"   : [
        {
          "ID"   : 9191,
          "Name" : "Luverdense",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1223,
          "Name" : "Portuguesa",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        3,
        1,
        0,
        0,
        3,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 15,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 59,
          "Player" : "Jocinei"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 69,
          "Player" : "Washington"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 72,
          "Player" : "Jean Patrick"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 1,
          "GT"     : 75,
          "Player" : "Rubinho"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514415,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "05-08-2014 00:30",
      "Comps"   : [
        {
          "ID"   : 8394,
          "Name" : "Salgueiro",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 7291,
          "Name" : "Treze PB",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        1,
        0,
        0,
        2,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 9,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 2,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 76,
          "Player" : "Ceara F."
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 79,
          "Player" : "Oliveira R."
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 90,
          "Player" : "Ze Roberto"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514099,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "03-08-2014 22:00",
      "Comps"   : [
        {
          "ID"   : 9104,
          "Name" : "Tupi",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1276,
          "Name" : "Guarani",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        1,
        1,
        1,
        1,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 9,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 2,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 8,
          "Player" : "Raphael"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 14,
          "Player" : "Fumagalli"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546315,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "03-08-2014 22:00",
      "Comps"   : [
        {
          "ID"   : 10322,
          "Name" : "Atletico/AC",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 7300,
          "Name" : "Sao Raimundo",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        1,
        0,
        1,
        2,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 8,
          "Player" : "Rafael"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 71,
          "Player" : "Juliano Cesar"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 73,
          "Player" : "Ismael"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"               : 1,
      "ID"                : 513396,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "03-08-2014 21:30",
      "Comps"             : [
        {
          "ID"   : 1209,
          "Name" : "Atletico Mineiro",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"    : 1210,
          "Name"  : "Atletico Paranaense",
          "SName" : "Paranaense",
          "CID"   : 21,
          "SID"   : 1
        }
      ],
      "Scrs"              : [
        3,
        1,
        1,
        0,
        3,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 13,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 35,
          "Player" : "Leonardo Silva"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 56,
          "Player" : "Marcos Guilherme"
        },
        {
          "Type"   : 0,
          "SType"  : 1,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 76,
          "Player" : "Luciano Pereira Mendes"
        },
        {
          "Type"   : 0,
          "SType"  : 1,
          "Num"    : 4,
          "Comp"   : 1,
          "GT"     : 87,
          "Player" : "Deivid"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 10,
          "Player" : "Pierre"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 25,
          "Player" : "Sueliton"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 58,
          "Player" : "Cleo"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 4,
          "Comp"   : 2,
          "GT"     : 69,
          "Player" : "Cleberson"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasStatistics"     : true,
      "HasLineups"        : true,
      "HasFieldPositions" : true,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Jo",
              "PID"            : 72415,
              "AthleteID"      : 46,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 50,
              "Status"         : 1,
              "SubstituteTime" : 72,
              "SubstituteType" : 2,
              "PlayerNum"      : 1
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Guilherme",
              "PID"            : 266199,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 100,
              "Status"         : 1,
              "SubstituteTime" : 61,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Alex Rodrigo Dias da Costa",
              "PID"               : 479266,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 61,
              "SubstituteType"    : 1,
              "PlayerNum"         : 13
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "J. Dátolo",
              "PID"               : 487745,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 72,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : true
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Marcelo",
              "PID"            : 81912,
              "AthleteID"      : 30,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 100,
              "Status"         : 1,
              "SubstituteTime" : 70,
              "SubstituteType" : 2,
              "PlayerNum"      : 1
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Cleo",
              "PID"            : 352756,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 0,
              "Status"         : 1,
              "SubstituteTime" : 83,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Bruno Furlan",
              "PID"               : 457533,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 70,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Dellatorre",
              "PID"               : 370703,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 83,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : true
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 513401,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : true,
      "STID"              : 3,
      "GT"                : 70,
      "GTD"               : "70'",
      "STime"             : now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear() + " 21:30",
      "Comps"             : [
        {
          "ID"   : 1216,
          "Name" : "Fluminense",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1217,
          "Name" : "Goias",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        2,
        0,
        2,
        0,
        2,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 13,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 10,
          "Player" : "Cicero"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 19,
          "Player" : "Dario Conca"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasStatistics"     : true,
      "HasLineups"        : true,
      "HasFieldPositions" : true,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Cícero",
              "PID"            : 429851,
              "Position"       : 0,
              "FieldLine"      : 50,
              "FieldSide"      : 0,
              "Status"         : 1,
              "SubstituteTime" : 70,
              "SubstituteType" : 2,
              "PlayerNum"      : 11
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Wagner",
              "PID"            : 341063,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 75,
              "Status"         : 1,
              "SubstituteTime" : 86,
              "SubstituteType" : 2,
              "PlayerNum"      : 3
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Rafael Sobis",
              "PID"            : 367025,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 50,
              "Status"         : 1,
              "SubstituteTime" : 62,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Fred",
              "PID"               : 94279,
              "AthleteID"         : 44,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 62,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Chiquinho",
              "PID"               : 362985,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 70,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Rafael Da Silva Francisco",
              "PID"               : 478688,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 86,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : true
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Moises Gomez Bordonado",
              "PID"            : 331061,
              "Position"       : 0,
              "FieldLine"      : 25,
              "FieldSide"      : 100,
              "Status"         : 1,
              "SubstituteTime" : 80,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Ramon",
              "PID"            : 272662,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 50,
              "Status"         : 1,
              "SubstituteTime" : 73,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Erik",
              "PID"            : 488002,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 75,
              "Status"         : 1,
              "SubstituteTime" : 63,
              "SubstituteType" : 2,
              "PlayerNum"      : 10
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Esquerdinha",
              "PID"               : 353910,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 73,
              "SubstituteType"    : 1,
              "PlayerNum"         : 20
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Assuério",
              "PID"               : 506216,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 80,
              "SubstituteType"    : 1,
              "PlayerNum"         : 14
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Murilo",
              "PID"               : 343784,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 63,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : true
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 513402,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "03-08-2014 21:30",
      "Comps"             : [
        {
          "ID"   : 1219,
          "Name" : "Internacional",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1224,
          "Name" : "Santos",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        1,
        0,
        0,
        0,
        1,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 13,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 57,
          "Player" : "Rafael Moura"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 38,
          "Player" : "Eder Lima"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 45,
          "Player" : "Mena E."
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 52,
          "Player" : "Paulao"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 4,
          "Comp"   : 1,
          "GT"     : 86,
          "Player" : "Henrique J."
        },
        {
          "Type"   : 2,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 55,
          "Player" : "Paulao"
        },
        {
          "Type"   : 2,
          "SType"  : -1,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 71,
          "Player" : "Mena"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasStatistics"     : true,
      "HasLineups"        : true,
      "HasFieldPositions" : true,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "A. D'Alessandro",
              "PID"            : 486760,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 0,
              "Status"         : 1,
              "SubstituteTime" : 86,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Alex Rodrigo Dias da Costa",
              "PID"            : 479266,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 100,
              "Status"         : 1,
              "SubstituteTime" : 59,
              "SubstituteType" : 2,
              "PlayerNum"      : 7
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Alan Patrick",
              "PID"            : 344226,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 50,
              "Status"         : 1,
              "SubstituteTime" : 69,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Ernando",
              "PID"               : 364002,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 59,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Jorge Henrique",
              "PID"               : 74199,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 69,
              "SubstituteType"    : 1,
              "PlayerNum"         : 20
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Ygor",
              "PID"               : 274595,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 86,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : true
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Alison",
              "PID"            : 408155,
              "Position"       : 0,
              "FieldLine"      : 50,
              "FieldSide"      : 75,
              "Status"         : 1,
              "SubstituteTime" : 63,
              "SubstituteType" : 2,
              "PlayerNum"      : 10
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Rildo",
              "PID"            : 393498,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 0,
              "Status"         : 1,
              "SubstituteTime" : 78,
              "SubstituteType" : 2,
              "PlayerNum"      : 9
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Gabriel",
              "PID"            : 479593,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 50,
              "Status"         : 1,
              "SubstituteTime" : 77,
              "SubstituteType" : 2,
              "PlayerNum"      : 1
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Diego Cardoso Nogueira",
              "PID"               : 470139,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 78,
              "SubstituteType"    : 1,
              "PlayerNum"         : 13
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Renato Dirnei Florencio",
              "PID"               : 479456,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 63,
              "SubstituteType"    : 1,
              "PlayerNum"         : 14
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Leandro Damiao",
              "PID"               : 287085,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 77,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : true
        }
      ]
    },
    {
      "SID"     : 1,
      "ID"      : 514098,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 45,
      "GTD"     : "45'",
      "STime"   : "03-08-2014 20:00",
      "Comps"   : [
        {
          "ID"   : 9188,
          "Name" : "Cuiaba",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1784,
          "Name" : "CRB",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        0,
        1,
        0,
        1,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 9,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 15,
          "Player" : "Bogé"
        },
        {
          "Type"   : 2,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 66,
          "Player" : "Bogé"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546176,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "03-08-2014 20:00",
      "Comps"   : [
        {
          "ID"   : 18778,
          "Name" : "Moto Clube/Ma",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9179,
          "Name" : "Guarany (CE)",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        3,
        1,
        2,
        0,
        3,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 25,
          "Player" : "Dante"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 42,
          "Player" : "Fabiano"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 76,
          "Player" : "Rodrigo Dantas"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 1,
          "GT"     : 81,
          "Player" : "Felipe"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546180,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "03-08-2014 20:00",
      "Comps"   : [
        {
          "ID"   : 9109,
          "Name" : "Operario",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 10248,
          "Name" : "Tombense",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        0,
        0,
        0,
        1,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 56,
          "Player" : "Ruy Cabeção"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546188,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "03-08-2014 20:00",
      "Comps"   : [
        {
          "ID"   : 12750,
          "Name" : "Genus (RO)",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 19541,
          "Name" : "Princesa/Am",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        2,
        0,
        1,
        0,
        2,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 26,
          "Player" : "Branco"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"               : 1,
      "ID"                : 513398,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "03-08-2014 19:00",
      "Comps"             : [
        {
          "ID"   : 7387,
          "Name" : "Chapecoense",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1215,
          "Name" : "Flamengo",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        1,
        0,
        1,
        0,
        1,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 13,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 9,
          "Player" : "Rafael Lima"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 21,
          "Player" : "Jailton"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 76,
          "Player" : "Abuda"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 85,
          "Player" : "Leandro"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasStatistics"     : true,
      "HasLineups"        : true,
      "HasFieldPositions" : true,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Neném",
              "PID"            : 508594,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 50,
              "Status"         : 1,
              "SubstituteTime" : 83,
              "SubstituteType" : 2,
              "PlayerNum"      : 7
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Bruno Rangel",
              "PID"            : 340664,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 25,
              "Status"         : 1,
              "SubstituteTime" : 77,
              "SubstituteType" : 2,
              "PlayerNum"      : 2
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Fabinho Alves",
              "PID"            : 374981,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 75,
              "Status"         : 1,
              "SubstituteTime" : 70,
              "SubstituteType" : 2,
              "PlayerNum"      : 10
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Camilo",
              "PID"               : 347955,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 83,
              "SubstituteType"    : 1,
              "PlayerNum"         : 17
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Rychely",
              "PID"               : 454699,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 70,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Leandro",
              "PID"               : 345537,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 77,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : true
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "João Paulo Gomes da Costa",
              "PID"            : 479592,
              "Position"       : 0,
              "FieldLine"      : 25,
              "FieldSide"      : 0,
              "Status"         : 1,
              "SubstituteTime" : 46,
              "SubstituteType" : 2,
              "PlayerNum"      : 6
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Hector Canteros",
              "PID"            : 342967,
              "Position"       : 0,
              "FieldLine"      : 50,
              "FieldSide"      : 25,
              "Status"         : 1,
              "SubstituteTime" : 64,
              "SubstituteType" : 2,
              "PlayerNum"      : 2
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Gabriel",
              "PID"            : 479593,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 100,
              "Status"         : 1,
              "SubstituteTime" : 64,
              "SubstituteType" : 2,
              "PlayerNum"      : 7
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Marion",
              "PID"               : 395300,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 64,
              "SubstituteType"    : 1,
              "PlayerNum"         : 20
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Marcio Araujo",
              "PID"               : 347242,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 46,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Guilherme Ferreira Pinto",
              "PID"               : 479605,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 64,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : true
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 513399,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "03-08-2014 19:00",
      "Comps"             : [
        {
          "ID"   : 1214,
          "Name" : "Figueirense",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1226,
          "Name" : "Sport Recife",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        3,
        0,
        1,
        0,
        3,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 13,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 43,
          "Player" : "Lisboal."
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 76,
          "Player" : "Clayton"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 84,
          "Player" : "Antonio"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 90,
          "Player" : "Durval"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasStatistics"     : true,
      "HasLineups"        : true,
      "HasFieldPositions" : true,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Kleber",
              "PID"            : 110986,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 10,
              "Status"         : 1,
              "SubstituteTime" : 11,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Marcos Aoás Correa",
              "PID"            : 479267,
              "Position"       : 0,
              "FieldLine"      : 25,
              "FieldSide"      : 33,
              "Status"         : 1,
              "SubstituteTime" : 79,
              "SubstituteType" : 2,
              "PlayerNum"      : 9
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Jean Carlos",
              "PID"            : 340632,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 10,
              "Status"         : 1,
              "SubstituteTime" : 68,
              "SubstituteType" : 2,
              "PlayerNum"      : 1
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Cleitinho",
              "PID"               : 358540,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 68,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Leo Lisboa",
              "PID"               : 488136,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 11,
              "SubstituteType"    : 1,
              "PlayerNum"         : 13
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Nirley",
              "PID"               : 459391,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 79,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : true
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Patric",
              "PID"            : 108074,
              "Position"       : 0,
              "FieldLine"      : 25,
              "FieldSide"      : 100,
              "Status"         : 1,
              "SubstituteTime" : 79,
              "SubstituteType" : 2,
              "PlayerNum"      : 1
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Zé Mário",
              "PID"            : 452973,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 50,
              "Status"         : 1,
              "SubstituteTime" : 59,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Ananias",
              "PID"            : 455872,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 100,
              "Status"         : 1,
              "SubstituteTime" : 59,
              "SubstituteType" : 2,
              "PlayerNum"      : 9
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Danilo",
              "PID"               : 234969,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 59,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Renan Oliveira",
              "PID"               : 369370,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 59,
              "SubstituteType"    : 1,
              "PlayerNum"         : 13
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Vitor",
              "PID"               : 411143,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 79,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : true
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 513400,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "03-08-2014 19:00",
      "Comps"             : [
        {
          "ID"   : 1212,
          "Name" : "Coritiba",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1267,
          "Name" : "Corinthians",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 13,
      "Events"            : [
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 12,
          "Player" : "Romero A."
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 42,
          "Player" : "Ze Eduardo"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 43,
          "Player" : "Fagner"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 4,
          "Comp"   : 1,
          "GT"     : 64,
          "Player" : "Alex"
        },
        {
          "Type"   : 2,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 66,
          "Player" : "Fagner"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : -1,
      "HasTips"           : false,
      "HasStatistics"     : true,
      "HasLineups"        : true,
      "HasFieldPositions" : true,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Germano",
              "PID"            : 340667,
              "Position"       : 0,
              "FieldLine"      : 50,
              "FieldSide"      : 25,
              "Status"         : 1,
              "SubstituteTime" : 70,
              "SubstituteType" : 2,
              "PlayerNum"      : 1
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Dudú",
              "PID"            : 487864,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 0,
              "Status"         : 1,
              "SubstituteTime" : 63,
              "SubstituteType" : 2,
              "PlayerNum"      : 9
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Ze Eduardo",
              "PID"            : 442519,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 50,
              "Status"         : 1,
              "SubstituteTime" : 75,
              "SubstituteType" : 2,
              "PlayerNum"      : 6
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Helder",
              "PID"               : 392404,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 63,
              "SubstituteType"    : 1,
              "PlayerNum"         : 17
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Keirrison",
              "PID"               : 82264,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 75,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Geraldo",
              "PID"               : 227021,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 70,
              "SubstituteType"    : 1,
              "PlayerNum"         : 20
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : true
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Jadson",
              "PID"            : 117733,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 10,
              "Status"         : 1,
              "SubstituteTime" : 70,
              "SubstituteType" : 2,
              "PlayerNum"      : 2
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Anderson Martins",
              "PID"            : 499883,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 10,
              "Status"         : 1,
              "SubstituteTime" : 57,
              "SubstituteType" : 2,
              "PlayerNum"      : 10
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Romarinho",
              "PID"            : 263557,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 90,
              "Status"         : 1,
              "SubstituteTime" : 81,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Luciano",
              "PID"               : 455066,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 81,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Malcon",
              "PID"               : 506156,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 70,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Renato Augusto",
              "PID"               : 355795,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 57,
              "SubstituteType"    : 1,
              "PlayerNum"         : 21
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : true
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 513403,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "03-08-2014 19:00",
      "Comps"             : [
        {
          "ID"   : 1222,
          "Name" : "Palmeiras",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1767,
          "Name" : "Bahia",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        1,
        1,
        0,
        0,
        1,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 13,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 61,
          "Player" : "Henrique"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 63,
          "Player" : "Kieza"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 3,
          "Player" : "Titi"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 11,
          "Player" : "Wendel"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 23,
          "Player" : "Rhayner"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 4,
          "Comp"   : 1,
          "GT"     : 24,
          "Player" : "Lucio"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : -1,
      "HasTips"           : false,
      "HasStatistics"     : true,
      "HasLineups"        : true,
      "HasFieldPositions" : true,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Wendel",
              "PID"            : 279165,
              "Position"       : 0,
              "FieldLine"      : 25,
              "FieldSide"      : 100,
              "Status"         : 1,
              "SubstituteTime" : 46,
              "SubstituteType" : 2,
              "PlayerNum"      : 3
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Bruno César",
              "PID"            : 72448,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 50,
              "Status"         : 1,
              "SubstituteTime" : 73,
              "SubstituteType" : 2,
              "PlayerNum"      : 1
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "P. Mouche",
              "PID"            : 492007,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 100,
              "Status"         : 1,
              "SubstituteTime" : 68,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Patrick Vieira",
              "PID"               : 27917,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 73,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "W. Mendieta",
              "PID"               : 488913,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 68,
              "SubstituteType"    : 1,
              "PlayerNum"         : 16
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Wellington",
              "PID"               : 358876,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 46,
              "SubstituteType"    : 1,
              "PlayerNum"         : 17
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : true
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Marcos Aurélio de Oliveira Lima",
              "PID"            : 478820,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 100,
              "Status"         : 1,
              "SubstituteTime" : 75,
              "SubstituteType" : 2,
              "PlayerNum"      : 2
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Kieza",
              "PID"            : 346378,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 50,
              "Status"         : 1,
              "SubstituteTime" : 90,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"      : 0,
              "PlayerName"     : "Fahel",
              "PID"            : 275249,
              "Position"       : 0,
              "FieldLine"      : 50,
              "FieldSide"      : 75,
              "Status"         : 1,
              "SubstituteTime" : 68,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Feijão",
              "PID"               : 435768,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 68,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "E. Biancucchi",
              "PID"               : 484250,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 90,
              "SubstituteType"    : 1,
              "PlayerNum"         : 17
            },
            {
              "JerseyNum"         : 0,
              "PlayerName"        : "Henrique",
              "PID"               : 83985,
              "AthleteID"         : 34,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 75,
              "SubstituteType"    : 1,
              "PlayerNum"         : 20
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : true
        }
      ]
    },
    {
      "SID"     : 1,
      "ID"      : 514093,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "03-08-2014 19:00",
      "Comps"   : [
        {
          "ID"    : 9083,
          "Name"  : "Caxias do Sul",
          "SName" : "Caxias",
          "CID"   : 21,
          "SID"   : 1
        },
        {
          "ID"   : 7064,
          "Name" : "Macae",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        0,
        1,
        0,
        1,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 9,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 9,
          "Player" : "Pagnussat"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514094,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "03-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 1771,
          "Name" : "Mogi Mirim",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1775,
          "Name" : "Juventude",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        0,
        0,
        0,
        1,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 9,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 74,
          "Player" : "Nando"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514097,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "03-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 1275,
          "Name" : "Sao Caetano",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 7073,
          "Name" : "Duque de Caxias",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        1,
        0,
        1,
        0,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 9,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 4,
          "Player" : "de Caxias"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514414,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "03-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 9203,
          "Name" : "Botafogo (PB)",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 10265,
          "Name" : "Águia de Marabá",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        0,
        1,
        0,
        2,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 9,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 24,
          "Player" : "Frontini"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 54,
          "Player" : "Ferreira"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 519186,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "03-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 7390,
          "Name" : "Paysandu",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9173,
          "Name" : "CRAC GO",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 9,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546174,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "03-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 19001,
          "Name" : "Baraúnas/Rn",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 19555,
          "Name" : "Coruripe/Al",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        1,
        1,
        0,
        1,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 41,
          "Player" : "Temisson"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 54,
          "Player" : "Alexsandro"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546175,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "03-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 19818,
          "Name" : "Santos Macapá/AP",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 20787,
          "Name" : "Rio Branco/Ac",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        2,
        0,
        1,
        1,
        2,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 35,
          "Player" : "Rodrigo"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 60,
          "Player" : "André"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 65,
          "Player" : "Matheus"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546182,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "03-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 18884,
          "Name" : "Maringá Fc/Pr",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 18755,
          "Name" : "Brasil Pelotas (RS)",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        1,
        0,
        0,
        2,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 48,
          "Player" : "Baiano"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 74,
          "Player" : "Alex Amado"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546183,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "03-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 9107,
          "Name" : "Villa Nova AC",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 20785,
          "Name" : "Itaporã/Ms",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        3,
        0,
        1,
        2,
        3,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 30,
          "Player" : "Gustavo"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 46,
          "Player" : "Fágner Lins"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 55,
          "Player" : "Fágner Lins"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 1,
          "GT"     : 67,
          "Player" : "Thiago Azulão"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 5,
          "Comp"   : 1,
          "GT"     : 90,
          "Player" : "Woshinton"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546184,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "03-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 9176,
          "Name" : "Goianesia",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 19571,
          "Name" : "Grêmio Barueri/Sp",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        0,
        1,
        0,
        1,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 30,
          "Player" : "Fernando Sa"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 575875,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "03-08-2014 18:30",
      "Comps"   : [
        {
          "ID"   : 20786,
          "Name" : "Ec Pelotas/Rs",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9113,
          "Name" : "Londrina",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        3,
        0,
        1,
        0,
        3,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 24,
          "Player" : "Joel"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 59,
          "Player" : "Joel"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 60,
          "Player" : "Léo Maringá"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"               : 1,
      "ID"                : 513404,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "03-08-2014 00:00",
      "Comps"             : [
        {
          "ID"   : 1228,
          "Name" : "Vitoria",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1218,
          "Name" : "Gremio",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        2,
        1,
        0,
        1,
        2,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 13,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 12,
          "Player" : "Barcos"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 59,
          "Player" : "Caio"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 77,
          "Player" : "Caio"
        },
        {
          "Type"   : 3,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 77,
          "Player" : "Caio"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasStatistics"     : true,
      "HasLineups"        : true,
      "HasFieldPositions" : true,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 5,
              "PlayerName"     : "Euller",
              "PID"            : 484306,
              "Position"       : 0,
              "FieldLine"      : 25,
              "FieldSide"      : 0,
              "Status"         : 1,
              "SubstituteTime" : 84,
              "SubstituteType" : 2,
              "PlayerNum"      : 10
            },
            {
              "JerseyNum"      : 6,
              "PlayerName"     : "Richarlyson",
              "PID"            : 358558,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 90,
              "Status"         : 1,
              "SubstituteTime" : 46,
              "SubstituteType" : 2,
              "PlayerNum"      : 7
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Régis",
              "PID"            : 400740,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 90,
              "Status"         : 1,
              "SubstituteTime" : 87,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"         : 19,
              "PlayerName"        : "William Henrique",
              "PID"               : 360998,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 46,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Danilo Tarracha",
              "PID"               : 502314,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 84,
              "SubstituteType"    : 1,
              "PlayerNum"         : 14
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Luiz Gustavo",
              "PID"               : 203068,
              "AthleteID"         : 39,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 87,
              "SubstituteType"    : 1,
              "PlayerNum"         : 20
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : true
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 8,
              "PlayerName"     : "Eduardo Pereira Rodrigues",
              "PID"            : 479581,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 0,
              "Status"         : 1,
              "SubstituteTime" : 73,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Luan Guilherme de Jesús Vieira",
              "PID"            : 479590,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 100,
              "Status"         : 1,
              "SubstituteTime" : 69,
              "SubstituteType" : 2,
              "PlayerNum"      : 11
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Hernan Barcos",
              "PID"            : 261791,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 50,
              "Status"         : 1,
              "SubstituteTime" : 78,
              "SubstituteType" : 2,
              "PlayerNum"      : 3
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Fernandinho",
              "PID"               : 349667,
              "AthleteID"         : 35,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 69,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Everton Sousa Soares",
              "PID"               : 479598,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 73,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 16,
              "PlayerName"        : "Lucas Heinzen Coelho",
              "PID"               : 479599,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 78,
              "SubstituteType"    : 1,
              "PlayerNum"         : 13
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : true
        }
      ]
    },
    {
      "SID"     : 1,
      "ID"      : 513781,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "03-08-2014 00:00",
      "Comps"   : [
        {
          "ID"   : 1781,
          "Name" : "Ceara",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 10247,
          "Name" : "Boa Esporte",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        2,
        1,
        1,
        2,
        2,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 22,
          "Player" : "Magno Alves"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 27,
          "Player" : "Fernando Karanga"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 76,
          "Player" : "Tomas"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 1,
          "GT"     : 85,
          "Player" : "Gil"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546181,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "02-08-2014 22:30",
      "Comps"   : [
        {
          "ID"   : 17055,
          "Name" : "Cabofriense",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1271,
          "Name" : "Ituano",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        1,
        1,
        0,
        2,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 34,
          "Player" : "Rodrigo Dias"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 51,
          "Player" : "Eberson"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 76,
          "Player" : "Caucaia"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514095,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "02-08-2014 22:00",
      "Comps"   : [
        {
          "ID"   : 7386,
          "Name" : "ASA AL",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1778,
          "Name" : "Fortaleza",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        3,
        1,
        1,
        1,
        3,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 9,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 9,
          "Player" : "Wanderson"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 36,
          "Player" : "Edinho"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 47,
          "Player" : "Robert"
        },
        {
          "Type"   : 2,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 25,
          "Player" : "Waldison"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"               : 1,
      "ID"                : 513397,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "02-08-2014 21:30",
      "Comps"             : [
        {
          "ID"   : 1211,
          "Name" : "Botafogo",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1213,
          "Name" : "Cruzeiro",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        1,
        1,
        1,
        0,
        1,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 13,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 24,
          "Player" : "Edilson"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 60,
          "Player" : "Aldo Leao Ramirez"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 15,
          "Player" : "Edilson"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 49,
          "Player" : "Emerson"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : -1,
      "HasTips"           : false,
      "HasStatistics"     : true,
      "HasLineups"        : true,
      "HasFieldPositions" : true,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 7,
              "PlayerName"     : "Carlos Alberto",
              "PID"            : 303484,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 50,
              "Status"         : 1,
              "SubstituteTime" : 71,
              "SubstituteType" : 2,
              "PlayerNum"      : 3
            },
            {
              "JerseyNum"      : 8,
              "PlayerName"     : "Mario Ariel Bolatti",
              "PID"            : 459540,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 0,
              "Status"         : 1,
              "SubstituteTime" : 56,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Rogerio",
              "PID"            : 345230,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 25,
              "Status"         : 1,
              "SubstituteTime" : 64,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"         : 19,
              "PlayerName"        : "Wallyson Ricardo Maciel Monteiro",
              "PID"               : 479434,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 56,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            },
            {
              "JerseyNum"         : 16,
              "PlayerName"        : "Julio César",
              "PID"               : 162578,
              "AthleteID"         : 25,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 64,
              "SubstituteType"    : 1,
              "PlayerNum"         : 20
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Joao Gabriel",
              "PID"               : 483606,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 71,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : true
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 7,
              "PlayerName"     : "Henrique",
              "PID"            : 83985,
              "AthleteID"      : 34,
              "Position"       : 0,
              "FieldLine"      : 50,
              "FieldSide"      : 75,
              "Status"         : 1,
              "SubstituteTime" : 54,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "M. Moreno",
              "PID"            : 500167,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 50,
              "Status"         : 1,
              "SubstituteTime" : 67,
              "SubstituteType" : 2,
              "PlayerNum"      : 11
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Marcos Aoás Correa",
              "PID"            : 479267,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 0,
              "Status"         : 1,
              "SubstituteTime" : 54,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "M. Samudio",
              "PID"               : 487022,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 54,
              "SubstituteType"    : 1,
              "PlayerNum"         : 17
            },
            {
              "JerseyNum"         : 20,
              "PlayerName"        : "Willian",
              "PID"               : 70719,
              "AthleteID"         : 37,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 54,
              "SubstituteType"    : 1,
              "PlayerNum"         : 21
            },
            {
              "JerseyNum"         : 17,
              "PlayerName"        : "Nilton",
              "PID"               : 404960,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 67,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : true
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 513405,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "02-08-2014 21:30",
      "Comps"             : [
        {
          "ID"   : 1225,
          "Name" : "Sao Paulo",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1780,
          "Name" : "Criciuma",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        1,
        1,
        0,
        0,
        1,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 13,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 74,
          "Player" : "Alan Kardec"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 80,
          "Player" : "Souza"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : -1,
      "HasTips"           : false,
      "HasStatistics"     : true,
      "HasLineups"        : true,
      "HasFieldPositions" : true,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 5,
              "PlayerName"     : "Dênis",
              "PID"            : 378203,
              "Position"       : 0,
              "FieldLine"      : 50,
              "FieldSide"      : 100,
              "Status"         : 1,
              "SubstituteTime" : 86,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Rodrigo Caio",
              "PID"            : 362197,
              "Position"       : 0,
              "FieldLine"      : 25,
              "FieldSide"      : 33,
              "Status"         : 1,
              "SubstituteTime" : 63,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Alexandre Pato",
              "PID"            : 77995,
              "Position"       : 0,
              "FieldLine"      : 100,
              "FieldSide"      : 75,
              "Status"         : 1,
              "SubstituteTime" : 77,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"         : 19,
              "PlayerName"        : "Paulo Miranda",
              "PID"               : 423994,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 63,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Ademilson",
              "PID"               : 270363,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 77,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 16,
              "PlayerName"        : "Húdson",
              "PID"               : 482911,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 86,
              "SubstituteType"    : 1,
              "PlayerNum"         : 13
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : true
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Ronaldo Alves",
              "PID"            : 484275,
              "Position"       : 0,
              "FieldLine"      : 25,
              "FieldSide"      : 66,
              "Status"         : 1,
              "SubstituteTime" : 66,
              "SubstituteType" : 2,
              "PlayerNum"      : 9
            },
            {
              "JerseyNum"      : 7,
              "PlayerName"     : "Wellington Bruno",
              "PID"            : 454701,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 10,
              "Status"         : 1,
              "SubstituteTime" : 18,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"      : 6,
              "PlayerName"     : "Ricardo Costa",
              "PID"            : 81908,
              "AthleteID"      : 801,
              "Position"       : 0,
              "FieldLine"      : 75,
              "FieldSide"      : 90,
              "Status"         : 1,
              "SubstituteTime" : 79,
              "SubstituteType" : 2,
              "PlayerNum"      : 2
            },
            {
              "JerseyNum"         : 16,
              "PlayerName"        : "Higor",
              "PID"               : 373994,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 18,
              "SubstituteType"    : 1,
              "PlayerNum"         : 16
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Maurinho",
              "PID"               : 340567,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 66,
              "SubstituteType"    : 1,
              "PlayerNum"         : 17
            },
            {
              "JerseyNum"         : 19,
              "PlayerName"        : "Maylson",
              "PID"               : 343900,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 0,
              "SubstituteTime"    : 79,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : true
        }
      ]
    },
    {
      "SID"     : 1,
      "ID"      : 513777,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "02-08-2014 19:20",
      "Comps"   : [
        {
          "ID"   : 8514,
          "Name" : "América Mineiro",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1776,
          "Name" : "ABC",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        0,
        0,
        0,
        1,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 90,
          "Player" : "Andrei"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513780,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "02-08-2014 19:20",
      "Comps"   : [
        {
          "ID"   : 1273,
          "Name" : "Bragantino",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9147,
          "Name" : "Joinville",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        0,
        1,
        0,
        1,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 35,
          "Player" : "Léo Jaime"
        },
        {
          "Type"   : 2,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 24,
          "Player" : "Lima"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513784,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "02-08-2014 19:20",
      "Comps"   : [
        {
          "ID"   : 7301,
          "Name" : "Sampaio Correa (MA)",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1266,
          "Name" : "Ponte Preta",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        3,
        3,
        2,
        2,
        3,
        3,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 4,
          "Player" : "Jailton"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 20,
          "Player" : "Ricardo Costa"
        },
        {
          "Type"   : 0,
          "SType"  : 2,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 25,
          "Player" : "Eloir Moreira Silva"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 1,
          "GT"     : 30,
          "Player" : "Eloir Moreira Silva"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 5,
          "Comp"   : 1,
          "GT"     : 82,
          "Player" : "Pimentinha"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 6,
          "Comp"   : 2,
          "GT"     : 88,
          "Player" : "Ricardo Costa"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513787,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "02-08-2014 19:20",
      "Comps"   : [
        {
          "ID"   : 1227,
          "Name" : "Vasco Da Gama",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1787,
          "Name" : "Parana",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        0,
        1,
        0,
        1,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 35,
          "Player" : "Dakson Soares Da Silva"
        },
        {
          "Type"   : 2,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 72,
          "Player" : "Anderson Rosa"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 545347,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "02-08-2014 19:20",
      "Comps"   : [
        {
          "ID"   : 1783,
          "Name" : "América (RN)",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 14154,
          "Name" : "Santa Cruz (PE)",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        1,
        0,
        1,
        0,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 33,
          "Player" : "Leo Gamalho"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 545766,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "02-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 10274,
          "Name" : "Estrela do Norte",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9172,
          "Name" : "Anapolina",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        4,
        3,
        2,
        1,
        4,
        3,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 23,
          "Player" : "Ronaldo Capixaba"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 28,
          "Player" : "Raphael Luz"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 34,
          "Player" : "Preto"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 1,
          "GT"     : 49,
          "Player" : "Ricardo Pereira"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 5,
          "Comp"   : 1,
          "GT"     : 71,
          "Player" : "Ronaldo Capixaba"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 6,
          "Comp"   : 2,
          "GT"     : 83,
          "Player" : "Thiago Floriano"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546173,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "02-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 19179,
          "Name" : "Interporto FC/To",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 7383,
          "Name" : "Clube do Remo",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        2,
        0,
        1,
        1,
        2,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 11,
          "Player" : "Max"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 58,
          "Player" : "Rafael Paty"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546177,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "02-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 5917,
          "Name" : "Campinese",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 10281,
          "Name" : "Jacuipense",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        1,
        0,
        1,
        1,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 41,
          "Player" : "Casagrande"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 76,
          "Player" : "Bismarck"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546178,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "02-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 11618,
          "Name" : "Betim EC (MG)",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 19000,
          "Name" : "Globo Fc/Rn",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        3,
        0,
        2,
        2,
        3,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 7,
          "Player" : "Ricardo Lopes"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 37,
          "Player" : "Renatinho Potiguar"
        },
        {
          "Type"   : 0,
          "SType"  : 2,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 60,
          "Player" : "Marcos Vinicius"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 2,
          "GT"     : 68,
          "Player" : "Ricardo Lopes"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546179,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "02-08-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 9124,
          "Name" : "Vitoria Conquista",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9210,
          "Name" : "Confianca",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        2,
        0,
        2,
        0,
        2,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 18,
          "Player" : "Leandro Kível"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 43,
          "Player" : "Wallace Pernambucano"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514090,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "02-08-2014 18:00",
      "Comps"   : [
        {
          "ID"   : 7063,
          "Name" : "Madureira",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1265,
          "Name" : "Guaratingueta",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        3,
        1,
        1,
        0,
        3,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 9,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 2,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 4,
          "Player" : "Victor Bolt"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 61,
          "Player" : "Clebson"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 71,
          "Player" : "Victor Bolt"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 2,
          "GT"     : 86,
          "Player" : "Nadson"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 545768,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "02-08-2014 18:00",
      "Comps"   : [
        {
          "ID"   : 10190,
          "Name" : "CA Penapolense",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 20781,
          "Name" : "Boavista/Rj",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        2,
        0,
        1,
        2,
        2,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 12,
          "Player" : "Cláudio Pagodinho"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 57,
          "Player" : "Guarú"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 65,
          "Player" : "Fio"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 2,
          "GT"     : 86,
          "Player" : "Jefinho"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513779,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "02-08-2014 00:00",
      "Comps"   : [
        {
          "ID"   : 1777,
          "Name" : "Avai",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9191,
          "Name" : "Luverdense",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        2,
        0,
        1,
        1,
        2,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 45,
          "Player" : "Braga"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 66,
          "Player" : "Misael"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 68,
          "Player" : "Welton Felipe"
        },
        {
          "Type"   : 2,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 90,
          "Player" : "Júlio Terceiro"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513785,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "02-08-2014 00:00",
      "Comps"   : [
        {
          "ID"   : 1782,
          "Name" : "Vila Nova",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"    : 5918,
          "Name"  : "Atletico Goianiense",
          "SName" : "Goianiense",
          "CID"   : 21,
          "SID"   : 1
        }
      ],
      "Scrs"    : [
        0,
        2,
        0,
        2,
        0,
        2,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 27,
          "Player" : "Winiciusm."
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 33,
          "Player" : "Luisa."
        },
        {
          "Type"   : 2,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 82,
          "Player" : "Radames"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"               : 1,
      "ID"                : 544803,
      "Comp"              : 115,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "01-08-2014 00:00",
      "Comps"             : [
        {
          "ID"   : 9113,
          "Name" : "Londrina",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1224,
          "Name" : "Santos",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        2,
        1,
        1,
        0,
        2,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 24,
          "Player" : "Joel"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 86,
          "Player" : "Geuvanio"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 90,
          "Player" : "Joel"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 3,
              "PlayerName"     : "Elias Bidia",
              "PID"            : 496188,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 83,
              "SubstituteType" : 2,
              "PlayerNum"      : 7
            },
            {
              "JerseyNum"      : 4,
              "PlayerName"     : "Allan Vieira",
              "PID"            : 531147,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 77,
              "SubstituteType" : 2,
              "PlayerNum"      : 10
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Edinaldo",
              "PID"            : 530805,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 66,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Rone Dias",
              "PID"               : 345110,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 9,
              "SubstituteTime"    : 66,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Diego Prates",
              "PID"               : 531149,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 4,
              "SubstituteTime"    : 77,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Leonardo Dagostini",
              "PID"               : 531150,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 3,
              "SubstituteTime"    : 83,
              "SubstituteType"    : 1,
              "PlayerNum"         : 13
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 2,
              "PlayerName"     : "Vinicius Simon",
              "PID"            : 531154,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 25,
              "SubstituteType" : 2,
              "PlayerNum"      : 11
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Jubal",
              "PID"            : 452452,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 76,
              "SubstituteType" : 2,
              "PlayerNum"      : 6
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Paulo",
              "PID"            : 401716,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 76,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Nailson",
              "PID"               : 488003,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 2,
              "SubstituteTime"    : 25,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Geuvânio",
              "PID"               : 482918,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 76,
              "SubstituteType"    : 1,
              "PlayerNum"         : 17
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Giva",
              "PID"               : 364622,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 76,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 546230,
      "Comp"              : 115,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "01-08-2014 00:00",
      "Comps"             : [
        {
          "ID"   : 1212,
          "Name" : "Coritiba",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 7390,
          "Name" : "Paysandu",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        2,
        0,
        1,
        0,
        2,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 43,
          "Player" : "Ze Eduardo"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 64,
          "Player" : "Keirrison"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 6,
              "PlayerName"     : "Riccardo Saponara",
              "PID"            : 355089,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 46,
              "SubstituteType" : 2,
              "PlayerNum"      : 11
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Dudú",
              "PID"            : 487864,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 84,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Ze Eduardo",
              "PID"            : 442519,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 46,
              "SubstituteType" : 2,
              "PlayerNum"      : 7
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Alex Rodrigo Dias da Costa",
              "PID"               : 479266,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 6,
              "SubstituteTime"    : 46,
              "SubstituteType"    : 1,
              "PlayerNum"         : 17
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "A. Martinuccio",
              "PID"               : 507835,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 6,
              "SubstituteTime"    : 46,
              "SubstituteType"    : 1,
              "PlayerNum"         : 16
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Misael",
              "PID"               : 373006,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 9,
              "SubstituteTime"    : 84,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 4,
              "PlayerName"     : "Airton Ribeiro Santos",
              "PID"            : 479463,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 76,
              "SubstituteType" : 2,
              "PlayerNum"      : 6
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Ricardo Capanema",
              "PID"            : 527967,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 46,
              "SubstituteType" : 2,
              "PlayerNum"      : 11
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Everton Silva",
              "PID"            : 527965,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 80,
              "SubstituteType" : 2,
              "PlayerNum"      : 9
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Dennis",
              "PID"               : 399860,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 46,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Alves Fabinho",
              "PID"               : 397623,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 4,
              "SubstituteTime"    : 76,
              "SubstituteType"    : 1,
              "PlayerNum"         : 14
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Héverton",
              "PID"               : 527945,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 11,
              "SubstituteTime"    : 80,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 544394,
      "Comp"              : 115,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "31-07-2014 01:00",
      "Comps"             : [
        {
          "ID"   : 1227,
          "Name" : "Vasco Da Gama",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1266,
          "Name" : "Ponte Preta",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        2,
        1,
        2,
        1,
        2,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 2,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 20,
          "Player" : "Alvaro Pereira"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 39,
          "Player" : "Cafu"
        },
        {
          "Type"   : 0,
          "SType"  : 1,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 42,
          "Player" : "Ricardo Costa"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Diogo Silva",
              "PID"            : 393762,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 77,
              "SubstituteType" : 2,
              "PlayerNum"      : 6
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Kléber",
              "PID"            : 487173,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 46,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Thalles",
              "PID"            : 358955,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 87,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Lucas Crispim",
              "PID"               : 517391,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 46,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "S. Montoya",
              "PID"               : 487879,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 9,
              "SubstituteTime"    : 77,
              "SubstituteType"    : 1,
              "PlayerNum"         : 13
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Edmilson",
              "PID"               : 397629,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 11,
              "SubstituteTime"    : 87,
              "SubstituteType"    : 1,
              "PlayerNum"         : 16
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 6,
              "PlayerName"     : "Adrianinho",
              "PID"            : 423981,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 46,
              "SubstituteType" : 2,
              "PlayerNum"      : 10
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Daniel Correa Freitas",
              "PID"            : 479454,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 24,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Ricardinho",
              "PID"            : 348034,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 69,
              "SubstituteType" : 2,
              "PlayerNum"      : 1
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Rossi",
              "PID"               : 370987,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 9,
              "SubstituteTime"    : 24,
              "SubstituteType"    : 1,
              "PlayerNum"         : 17
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Rodolfo",
              "PID"               : 115729,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 6,
              "SubstituteTime"    : 46,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Alexandro",
              "PID"               : 461152,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 69,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 545502,
      "Comp"              : 115,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "31-07-2014 01:00",
      "Comps"             : [
        {
          "ID"   : 1273,
          "Name" : "Bragantino",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1225,
          "Name" : "Sao Paulo",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        1,
        2,
        0,
        1,
        1,
        2,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 17,
          "Player" : "Bruno Recife"
        },
        {
          "Type"   : 0,
          "SType"  : 2,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 77,
          "Player" : "Alexandre Pato"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 84,
          "Player" : "Luisinho"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 2,
      "HasTips"           : false,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 5,
              "PlayerName"     : "Magno Cruz",
              "PID"            : 386737,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 66,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"      : 6,
              "PlayerName"     : "Gustavo Campanharo",
              "PID"            : 488934,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 46,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Cesinha",
              "PID"            : 262158,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 84,
              "SubstituteType" : 2,
              "PlayerNum"      : 2
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Marcelo Henrique",
              "PID"               : 528636,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 6,
              "SubstituteTime"    : 46,
              "SubstituteType"    : 1,
              "PlayerNum"         : 13
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Alexandre",
              "PID"               : 365810,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 5,
              "SubstituteTime"    : 66,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Rafael Defendi",
              "PID"               : 488931,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 11,
              "SubstituteTime"    : 84,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [ ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 546068,
      "Comp"              : 115,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "31-07-2014 01:00",
      "Comps"             : [
        {
          "ID"   : 1219,
          "Name" : "Internacional",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1781,
          "Name" : "Ceara",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        1,
        2,
        0,
        0,
        1,
        2,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 55,
          "Player" : "Nikao"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 92,
          "Player" : "Ruschel A."
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 93,
          "Player" : "Ricardinho"
        },
        {
          "Type"   : 3,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 16,
          "Player" : "Magno Alves"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 2,
      "HasTips"           : false,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 3,
              "PlayerName"     : "Fabri",
              "PID"            : 460868,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 79,
              "SubstituteType" : 2,
              "PlayerNum"      : 9
            },
            {
              "JerseyNum"      : 6,
              "PlayerName"     : "Joao Afonso",
              "PID"            : 366226,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 65,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Alan Patrick",
              "PID"            : 344226,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 79,
              "SubstituteType" : 2,
              "PlayerNum"      : 3
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Ygor",
              "PID"               : 274595,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 6,
              "SubstituteTime"    : 65,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Eduardo Sasha",
              "PID"               : 377132,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 3,
              "SubstituteTime"    : 79,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Carlos Martin Luque",
              "PID"               : 354092,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 3,
              "SubstituteTime"    : 79,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 8,
              "PlayerName"     : "Nikão",
              "PID"            : 502362,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 90,
              "SubstituteType" : 2,
              "PlayerNum"      : 1
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Eduardo",
              "PID"            : 27254,
              "AthleteID"      : 795,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 88,
              "SubstituteType" : 2,
              "PlayerNum"      : 11
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Alvesm.",
              "PID"            : 515483,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 69,
              "SubstituteType" : 2,
              "PlayerNum"      : 2
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Michel Platini",
              "PID"               : 466191,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 69,
              "SubstituteType"    : 1,
              "PlayerNum"         : 16
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Gustavo",
              "PID"               : 355662,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 9,
              "SubstituteTime"    : 88,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Felipe Amorim",
              "PID"               : 384537,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 8,
              "SubstituteTime"    : 90,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"     : 1,
      "ID"      : 544787,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "31-07-2014 00:00",
      "Comps"   : [
        {
          "ID"   : 12750,
          "Name" : "Genus (RO)",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 10322,
          "Name" : "Atletico/AC",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        0,
        0,
        0,
        1,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"               : 1,
      "ID"                : 544393,
      "Comp"              : 115,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "30-07-2014 22:30",
      "Comps"             : [
        {
          "ID"   : 9092,
          "Name" : "Novo Hamburgo",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1776,
          "Name" : "ABC",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        2,
        0,
        1,
        0,
        2,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 28,
          "Player" : "Afonso"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 92,
          "Player" : "Juba"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 4,
              "PlayerName"     : "Afonso",
              "PID"            : 398285,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 78,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"      : 6,
              "PlayerName"     : "Preto",
              "PID"            : 365544,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 84,
              "SubstituteType" : 2,
              "PlayerNum"      : 6
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Jonas",
              "PID"            : 227012,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 75,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Celsinho",
              "PID"               : 340637,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 9,
              "SubstituteTime"    : 75,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Edinaldo",
              "PID"               : 530805,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 4,
              "SubstituteTime"    : 78,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Felipe Athirson",
              "PID"               : 398256,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 6,
              "SubstituteTime"    : 84,
              "SubstituteType"    : 1,
              "PlayerNum"         : 14
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 6,
              "PlayerName"     : "Sueliton",
              "PID"            : 392655,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 56,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Júnior Timbó",
              "PID"            : 400838,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 67,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Lúcio Flávio",
              "PID"            : 373508,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 77,
              "SubstituteType" : 2,
              "PlayerNum"      : 3
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Edilson",
              "PID"               : 405046,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 6,
              "SubstituteTime"    : 56,
              "SubstituteType"    : 1,
              "PlayerNum"         : 17
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Gilmar",
              "PID"               : 343809,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 9,
              "SubstituteTime"    : 67,
              "SubstituteType"    : 1,
              "PlayerNum"         : 13
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "João Paulo Gomes da Costa",
              "PID"               : 479592,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 11,
              "SubstituteTime"    : 77,
              "SubstituteType"    : 1,
              "PlayerNum"         : 16
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"     : 1,
      "ID"      : 544143,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "30-07-2014 00:00",
      "Comps"   : [
        {
          "ID"   : 1223,
          "Name" : "Portuguesa",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1772,
          "Name" : "Oeste",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 544144,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "29-07-2014 22:00",
      "Comps"   : [
        {
          "ID"   : 1221,
          "Name" : "Nautico Recife",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 7552,
          "Name" : "Icasa CE",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        0,
        1,
        0,
        1,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 14,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 38,
          "Player" : "Marinho"
        },
        {
          "Type"   : 2,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 87,
          "Player" : "Paulinho"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 546104,
      "Comp"    : 5518,
      "Season"  : 2,
      "Stage"   : 1,
      "Group"   : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "29-07-2014 00:30",
      "Comps"   : [
        {
          "ID"   : 1276,
          "Name" : "Guarani",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"    : 9083,
          "Name"  : "Caxias do Sul",
          "SName" : "Caxias",
          "CID"   : 21,
          "SID"   : 1
        }
      ],
      "Scrs"    : [
        1,
        1,
        1,
        1,
        1,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 8,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 12,
          "Player" : "Renan Mota"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 26,
          "Player" : "Thiago Santana"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514092,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 22:00",
      "Comps"   : [
        {
          "ID"   : 1775,
          "Name" : "Juventude",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 7063,
          "Name" : "Madureira",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        2,
        0,
        1,
        0,
        2,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 8,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 21,
          "Player" : "Agusto F."
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 92,
          "Player" : "Gilson"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 543947,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 22:00",
      "Comps"   : [
        {
          "ID"   : 10322,
          "Name" : "Atletico/AC",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 19818,
          "Name" : "Santos Macapá/AP",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"               : 1,
      "ID"                : 513391,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "27-07-2014 21:30",
      "Comps"             : [
        {
          "ID"   : 1215,
          "Name" : "Flamengo",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1211,
          "Name" : "Botafogo",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        1,
        0,
        1,
        0,
        1,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 12,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 33,
          "Player" : "Alecsandro"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 25,
          "Player" : "Carlos Alberto"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 39,
          "Player" : "Moura L."
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 71,
          "Player" : "Edilson"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 4,
          "Comp"   : 1,
          "GT"     : 75,
          "Player" : "Alecsandro"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 5,
          "Comp"   : 2,
          "GT"     : 76,
          "Player" : "Airton"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 6,
          "Comp"   : 1,
          "GT"     : 80,
          "Player" : "Martin Caceres"
        },
        {
          "Type"   : 2,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 90,
          "Player" : "Martin Caceres"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasStatistics"     : true,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 6,
              "PlayerName"     : "Éverton Cardoso da Silva",
              "PID"            : 479597,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 73,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"      : 8,
              "PlayerName"     : "Lucas Andrés Mugni",
              "PID"            : 479604,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 63,
              "SubstituteType" : 2,
              "PlayerNum"      : 7
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Paulinho",
              "PID"            : 71185,
              "AthleteID"      : 40,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 63,
              "SubstituteType" : 2,
              "PlayerNum"      : 1
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "César",
              "PID"               : 399006,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 8,
              "SubstituteTime"    : 63,
              "SubstituteType"    : 1,
              "PlayerNum"         : 21
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Eduardo",
              "PID"               : 27254,
              "AthleteID"         : 795,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 8,
              "SubstituteTime"    : 63,
              "SubstituteType"    : 1,
              "PlayerNum"         : 23
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Chris Vieira",
              "PID"               : 500834,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 6,
              "SubstituteTime"    : 73,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 6,
              "PlayerName"     : "Carlos Alberto",
              "PID"            : 303484,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 77,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"      : 7,
              "PlayerName"     : "Mario Ariel Bolatti",
              "PID"            : 459540,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 46,
              "SubstituteType" : 2,
              "PlayerNum"      : 7
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Yuri Mamute",
              "PID"            : 347967,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 59,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "André Luiz Bahía Santos Viana",
              "PID"               : 479457,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 7,
              "SubstituteTime"    : 46,
              "SubstituteType"    : 1,
              "PlayerNum"         : 14
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Geirton Marques Aires",
              "PID"               : 479459,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 11,
              "SubstituteTime"    : 59,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Rodolfo",
              "PID"               : 115729,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 6,
              "SubstituteTime"    : 77,
              "SubstituteType"    : 1,
              "PlayerNum"         : 20
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 513393,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "27-07-2014 21:30",
      "Comps"             : [
        {
          "ID"   : 1218,
          "Name" : "Gremio",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1212,
          "Name" : "Coritiba",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        2,
        3,
        0,
        0,
        2,
        3,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 12,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 49,
          "Player" : "Ze Eduardo"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 57,
          "Player" : "Barcos"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 65,
          "Player" : "Barcos"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 2,
          "GT"     : 73,
          "Player" : "Ze Eduardo"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 5,
          "Comp"   : 2,
          "GT"     : 90,
          "Player" : "Alex"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 42,
          "Player" : "Luccas Claro"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 2,
      "HasTips"           : false,
      "HasStatistics"     : true,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 5,
              "PlayerName"     : "Saimon",
              "PID"            : 420874,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 46,
              "SubstituteType" : 2,
              "PlayerNum"      : 11
            },
            {
              "JerseyNum"      : 8,
              "PlayerName"     : "Ramiro Moschen Benetti",
              "PID"            : 479587,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 46,
              "SubstituteType" : 2,
              "PlayerNum"      : 7
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Fernandinho",
              "PID"            : 349667,
              "AthleteID"      : 35,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 78,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Lucas Heinzen Coelho",
              "PID"               : 479599,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 5,
              "SubstituteTime"    : 46,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Jean Deretti",
              "PID"               : 359088,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 5,
              "SubstituteTime"    : 46,
              "SubstituteType"    : 1,
              "PlayerNum"         : 17
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Eduardo Pereira Rodrigues",
              "PID"               : 479581,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 11,
              "SubstituteTime"    : 78,
              "SubstituteType"    : 1,
              "PlayerNum"         : 13
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 8,
              "PlayerName"     : "Riccardo Saponara",
              "PID"            : 355089,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 87,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Dudú",
              "PID"            : 487864,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 70,
              "SubstituteType" : 2,
              "PlayerNum"      : 9
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Ze Eduardo",
              "PID"            : 442519,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 87,
              "SubstituteType" : 2,
              "PlayerNum"      : 6
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Geraldo",
              "PID"               : 227021,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 70,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Chico",
              "PID"               : 282509,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 8,
              "SubstituteTime"    : 87,
              "SubstituteType"    : 1,
              "PlayerNum"         : 20
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "A. Martinuccio",
              "PID"               : 507835,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 8,
              "SubstituteTime"    : 87,
              "SubstituteType"    : 1,
              "PlayerNum"         : 14
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"     : 1,
      "ID"      : 514413,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 20:00",
      "Comps"   : [
        {
          "ID"   : 7291,
          "Name" : "Treze PB",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 7390,
          "Name" : "Paysandu",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        3,
        0,
        1,
        0,
        3,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 8,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 39,
          "Player" : "Maicon"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 50,
          "Player" : "Javier Aquino"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 76,
          "Player" : "Maicon"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 543739,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 20:00",
      "Comps"   : [
        {
          "ID"   : 19541,
          "Name" : "Princesa/Am",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 20787,
          "Name" : "Rio Branco/Ac",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 543740,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 20:00",
      "Comps"   : [
        {
          "ID"   : 18778,
          "Name" : "Moto Clube/Ma",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 19179,
          "Name" : "Interporto FC/To",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        2,
        1,
        1,
        2,
        2,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 31,
          "Player" : "Fabiano"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 36,
          "Player" : "Marcos Paulo"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 58,
          "Player" : "Fabiano"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 2,
          "GT"     : 69,
          "Player" : "Corentin Jean"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 544225,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 20:00",
      "Comps"   : [
        {
          "ID"   : 7300,
          "Name" : "Sao Raimundo",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 12750,
          "Name" : "Genus (RO)",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        0,
        0,
        0,
        2,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 47,
          "Player" : "Evandro"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"               : 1,
      "ID"                : 513386,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "27-07-2014 19:00",
      "Comps"             : [
        {
          "ID"    : 1210,
          "Name"  : "Atletico Paranaense",
          "SName" : "Paranaense",
          "CID"   : 21,
          "SID"   : 1
        },
        {
          "ID"   : 1216,
          "Name" : "Fluminense",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        0,
        3,
        0,
        2,
        0,
        3,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 12,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 18,
          "Player" : "Jean"
        },
        {
          "Type"   : 0,
          "SType"  : 2,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 35,
          "Player" : "Dario Conca"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 66,
          "Player" : "Cicero"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 34,
          "Player" : "Weverton"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 2,
      "HasTips"           : false,
      "HasStatistics"     : true,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 5,
              "PlayerName"     : "Otavio",
              "PID"            : 404386,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 83,
              "SubstituteType" : 2,
              "PlayerNum"      : 9
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Ederson",
              "PID"            : 297476,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 62,
              "SubstituteType" : 2,
              "PlayerNum"      : 3
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Douglas Coutinho",
              "PID"            : 357513,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 62,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Cleo",
              "PID"               : 352756,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 9,
              "SubstituteTime"    : 62,
              "SubstituteType"    : 1,
              "PlayerNum"         : 21
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Derley",
              "PID"               : 345014,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 9,
              "SubstituteTime"    : 62,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Dellatorre",
              "PID"               : 370703,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 5,
              "SubstituteTime"    : 83,
              "SubstituteType"    : 1,
              "PlayerNum"         : 16
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 2,
              "PlayerName"     : "Henrique",
              "PID"            : 83985,
              "AthleteID"      : 34,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 68,
              "SubstituteType" : 2,
              "PlayerNum"      : 1
            },
            {
              "JerseyNum"      : 7,
              "PlayerName"     : "Wagner",
              "PID"            : 341063,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 78,
              "SubstituteType" : 2,
              "PlayerNum"      : 6
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Rafael Sobis",
              "PID"            : 367025,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 63,
              "SubstituteType" : 2,
              "PlayerNum"      : 10
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Fabrício",
              "PID"               : 360999,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 11,
              "SubstituteTime"    : 63,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Chiquinho",
              "PID"               : 362985,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 2,
              "SubstituteTime"    : 68,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Edson",
              "PID"               : 349779,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 7,
              "SubstituteTime"    : 78,
              "SubstituteType"    : 1,
              "PlayerNum"         : 17
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 513388,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "27-07-2014 19:00",
      "Comps"             : [
        {
          "ID"   : 1267,
          "Name" : "Corinthians",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1222,
          "Name" : "Palmeiras",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        2,
        0,
        0,
        0,
        2,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 12,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 51,
          "Player" : "P. Guerrero"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 90,
          "Player" : "Petros"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 64,
          "Player" : "Henrique"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasStatistics"     : true,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 6,
              "PlayerName"     : "Andres Romero",
              "PID"            : 376682,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 84,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "P. Guerrero",
              "PID"            : 506143,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 90,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Anderson Martins",
              "PID"            : 499883,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 75,
              "SubstituteType" : 2,
              "PlayerNum"      : 7
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Danilo Fernandes",
              "PID"               : 440080,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 11,
              "SubstituteTime"    : 75,
              "SubstituteType"    : 1,
              "PlayerNum"         : 14
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Luiz Felipe",
              "PID"               : 479583,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 6,
              "SubstituteTime"    : 84,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Esquerdinha",
              "PID"               : 353910,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 90,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 8,
              "PlayerName"     : "W. Mendieta",
              "PID"            : 488913,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 55,
              "SubstituteType" : 2,
              "PlayerNum"      : 9
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Henrique",
              "PID"            : 83985,
              "AthleteID"      : 34,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 73,
              "SubstituteType" : 2,
              "PlayerNum"      : 2
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Deola",
              "PID"               : 526852,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 8,
              "SubstituteTime"    : 55,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Felipe Menezes",
              "PID"               : 374946,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 11,
              "SubstituteTime"    : 73,
              "SubstituteType"    : 1,
              "PlayerNum"         : 16
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 513392,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "27-07-2014 19:00",
      "Comps"             : [
        {
          "ID"   : 1217,
          "Name" : "Goias",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1225,
          "Name" : "Sao Paulo",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        2,
        1,
        1,
        0,
        2,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 12,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 45,
          "Player" : "Amaral"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 48,
          "Player" : "Bruno"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 76,
          "Player" : "Kaka"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 68,
          "Player" : "Erik"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasStatistics"     : true,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 8,
              "PlayerName"     : "Ramon",
              "PID"            : 272662,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 65,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Danilo",
              "PID"            : 234969,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 79,
              "SubstituteType" : 2,
              "PlayerNum"      : 3
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Erik",
              "PID"            : 488002,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 90,
              "SubstituteType" : 2,
              "PlayerNum"      : 11
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Edson",
              "PID"               : 349779,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 8,
              "SubstituteTime"    : 65,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Leo Veloso",
              "PID"               : 529739,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 79,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Valmir Lucas",
              "PID"               : 527786,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 11,
              "SubstituteTime"    : 90,
              "SubstituteType"    : 1,
              "PlayerNum"         : 14
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 5,
              "PlayerName"     : "Lucão",
              "PID"            : 393467,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 65,
              "SubstituteType" : 2,
              "PlayerNum"      : 2
            },
            {
              "JerseyNum"      : 6,
              "PlayerName"     : "Renato Dirnei Florencio",
              "PID"            : 479456,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 79,
              "SubstituteType" : 2,
              "PlayerNum"      : 11
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Ademilson",
              "PID"            : 270363,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 46,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Alexandre Pato",
              "PID"               : 77995,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 11,
              "SubstituteTime"    : 46,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Denílson",
              "PID"               : 453532,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 5,
              "SubstituteTime"    : 65,
              "SubstituteType"    : 1,
              "PlayerNum"         : 17
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Edson Silva",
              "PID"               : 424015,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 6,
              "SubstituteTime"    : 79,
              "SubstituteType"    : 1,
              "PlayerNum"         : 16
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 513395,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "27-07-2014 19:00",
      "Comps"             : [
        {
          "ID"   : 1226,
          "Name" : "Sport Recife",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1209,
          "Name" : "Atletico Mineiro",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        2,
        1,
        0,
        0,
        2,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 12,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 52,
          "Player" : "Felipe Azevedo"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 69,
          "Player" : "Durval"
        },
        {
          "Type"   : 0,
          "SType"  : 2,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 85,
          "Player" : "Diego Tardelli"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 54,
          "Player" : "Silva G."
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 56,
          "Player" : "Victor"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasStatistics"     : true,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 4,
              "PlayerName"     : "Ewerton Páscoa",
              "PID"            : 481791,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 46,
              "SubstituteType" : 2,
              "PlayerNum"      : 9
            },
            {
              "JerseyNum"      : 7,
              "PlayerName"     : "Zé Mário",
              "PID"            : 452973,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 67,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Saulo",
              "PID"            : 401449,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 78,
              "SubstituteType" : 2,
              "PlayerNum"      : 10
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Danilo",
              "PID"               : 234969,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 4,
              "SubstituteTime"    : 46,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Renan Oliveira",
              "PID"               : 369370,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 7,
              "SubstituteTime"    : 67,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Ferron",
              "PID"               : 270431,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 9,
              "SubstituteTime"    : 78,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 6,
              "PlayerName"     : "Pierre",
              "PID"            : 401701,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 89,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Jo",
              "PID"            : 72415,
              "AthleteID"      : 46,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 64,
              "SubstituteType" : 2,
              "PlayerNum"      : 1
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Reginaldo de Matos Maicosuel",
              "PID"            : 78421,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 65,
              "SubstituteType" : 2,
              "PlayerNum"      : 2
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Alex Rodrigo Dias da Costa",
              "PID"               : 479266,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 9,
              "SubstituteTime"    : 64,
              "SubstituteType"    : 1,
              "PlayerNum"         : 13
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Giovanni",
              "PID"               : 353928,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 65,
              "SubstituteType"    : 1,
              "PlayerNum"         : 17
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Maicon",
              "PID"               : 82638,
              "AthleteID"         : 32,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 6,
              "SubstituteTime"    : 89,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"     : 1,
      "ID"      : 514088,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 10265,
          "Name" : "Águia de Marabá",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9188,
          "Name" : "Cuiaba",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        1,
        1,
        1,
        2,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 8,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 25,
          "Player" : "Valdanes"
        },
        {
          "Type"   : 0,
          "SType"  : 2,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 37,
          "Player" : "Careca"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 78,
          "Player" : "Leonardy"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514091,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 1784,
          "Name" : "CRB",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 8394,
          "Name" : "Salgueiro",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        2,
        0,
        0,
        2,
        2,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 8,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 52,
          "Player" : "Eder"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 61,
          "Player" : "Marcus Vinicius"
        },
        {
          "Type"   : 0,
          "SType"  : 1,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 69,
          "Player" : "Jeferson Maranhão"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 2,
          "GT"     : 88,
          "Player" : "Vitor Caicó"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 519185,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 9173,
          "Name" : "CRAC GO",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 7386,
          "Name" : "ASA AL",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 8,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 543741,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 20784,
          "Name" : "River/Pi",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 7383,
          "Name" : "Clube do Remo",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        1,
        0,
        0,
        0,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 73,
          "Player" : "Michel"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 543742,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 9166,
          "Name" : "Central",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 5917,
          "Name" : "Campinese",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        1,
        1,
        1,
        1,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 5,
          "Player" : "Josimar"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 13,
          "Player" : "Eduardo Eré"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 543743,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 10281,
          "Name" : "Jacuipense",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 19001,
          "Name" : "Baraúnas/Rn",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        4,
        1,
        1,
        0,
        4,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 8,
          "Player" : "Tote"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 50,
          "Player" : "Casagrande"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 68,
          "Player" : "Junior"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 2,
          "GT"     : 77,
          "Player" : "Anderson Sobral"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 5,
          "Comp"   : 1,
          "GT"     : 87,
          "Player" : "Robert"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 543744,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 9210,
          "Name" : "Confianca",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9164,
          "Name" : "Porto PE",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        1,
        1,
        0,
        1,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 37,
          "Player" : "Bibi"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 63,
          "Player" : "Étinho"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 543745,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 19000,
          "Name" : "Globo Fc/Rn",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9124,
          "Name" : "Vitoria Conquista",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        3,
        1,
        0,
        1,
        3,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 8,
          "Player" : "Willian"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 72,
          "Player" : "Renatinho Potiguar"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 73,
          "Player" : "Romarinho"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 1,
          "GT"     : 90,
          "Player" : "Vavá"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 543746,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 19520,
          "Name" : "Brasiliense",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 10274,
          "Name" : "Estrela do Norte",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        3,
        0,
        1,
        0,
        3,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 5,
          "Player" : "Dedê"
        },
        {
          "Type"   : 0,
          "SType"  : 2,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 55,
          "Player" : "Cirilo"
        },
        {
          "Type"   : 0,
          "SType"  : 2,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 66,
          "Player" : "Baiano"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 543747,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 9172,
          "Name" : "Anapolina",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9107,
          "Name" : "Villa Nova AC",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        1,
        0,
        1,
        1,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 25,
          "Player" : "Nilo"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 63,
          "Player" : "Dinei"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 543748,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 19571,
          "Name" : "Grêmio Barueri/Sp",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 11699,
          "Name" : "Luziânia/DF",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        1,
        0,
        0,
        0,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 543750,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 18755,
          "Name" : "Brasil Pelotas (RS)",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 17055,
          "Name" : "Cabofriense",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        1,
        1,
        0,
        2,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 24,
          "Player" : "Felipe Garcia"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 64,
          "Player" : "Cirilo"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 67,
          "Player" : "Luizão"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 543751,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 9113,
          "Name" : "Londrina",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9148,
          "Name" : "Metropolitano",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        0,
        0,
        0,
        1,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 66,
          "Player" : "Bruno Batata"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 544050,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 10273,
          "Name" : "SERC Guarani",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 18884,
          "Name" : "Maringá Fc/Pr",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        1,
        1,
        1,
        1,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 7,
          "Player" : "Felipe Oliveira"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 22,
          "Player" : "Eydison"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"               : 1,
      "ID"                : 513387,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "27-07-2014 00:00",
      "Comps"             : [
        {
          "ID"   : 1767,
          "Name" : "Bahia",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1219,
          "Name" : "Internacional",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        0,
        1,
        0,
        0,
        0,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 12,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 66,
          "Player" : "Wellington Silva"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 56,
          "Player" : "Uelliton"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 61,
          "Player" : "Juan"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 62,
          "Player" : "Alan"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 2,
      "HasTips"           : false,
      "HasStatistics"     : true,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 7,
              "PlayerName"     : "Douglas Pires",
              "PID"            : 506215,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 57,
              "SubstituteType" : 2,
              "PlayerNum"      : 10
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Rhayner",
              "PID"            : 105136,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 86,
              "SubstituteType" : 2,
              "PlayerNum"      : 6
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Henrique",
              "PID"            : 83985,
              "AthleteID"      : 34,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 68,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Fernando Torres",
              "PID"               : 27206,
              "AthleteID"         : 133,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 7,
              "SubstituteTime"    : 57,
              "SubstituteType"    : 1,
              "PlayerNum"         : 22
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "M. Biancucchi",
              "PID"               : 506214,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 11,
              "SubstituteTime"    : 68,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "E. Biancucchi",
              "PID"               : 484250,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 9,
              "SubstituteTime"    : 86,
              "SubstituteType"    : 1,
              "PlayerNum"         : 14
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 6,
              "PlayerName"     : "A. D'Alessandro",
              "PID"            : 486760,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 46,
              "SubstituteType" : 2,
              "PlayerNum"      : 11
            },
            {
              "JerseyNum"      : 7,
              "PlayerName"     : "Alex Rodrigo Dias da Costa",
              "PID"            : 479266,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 86,
              "SubstituteType" : 2,
              "PlayerNum"      : 10
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Alan Patrick",
              "PID"            : 344226,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 79,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Eduardo Sasha",
              "PID"               : 377132,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 6,
              "SubstituteTime"    : 46,
              "SubstituteType"    : 1,
              "PlayerNum"         : 16
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Claudio Winck",
              "PID"               : 433044,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 79,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Ernando",
              "PID"               : 364002,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 7,
              "SubstituteTime"    : 86,
              "SubstituteType"    : 1,
              "PlayerNum"         : 14
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"     : 1,
      "ID"      : 513771,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 00:00",
      "Comps"   : [
        {
          "ID"   : 1787,
          "Name" : "Parana",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1776,
          "Name" : "ABC",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        0,
        0,
        0,
        1,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 13,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 77,
          "Player" : "Alisson"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513775,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "27-07-2014 00:00",
      "Comps"   : [
        {
          "ID"   : 7301,
          "Name" : "Sampaio Correa (MA)",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1782,
          "Name" : "Vila Nova",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        0,
        2,
        0,
        2,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 13,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 12,
          "Player" : "Marcio Diogo"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 14,
          "Player" : "William Paulista"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514412,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "26-07-2014 22:00",
      "Comps"   : [
        {
          "ID"   : 1778,
          "Name" : "Fortaleza",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9203,
          "Name" : "Botafogo (PB)",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 8,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"               : 1,
      "ID"                : 513389,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "26-07-2014 21:30",
      "Comps"             : [
        {
          "ID"   : 1780,
          "Name" : "Criciuma",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1228,
          "Name" : "Vitoria",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        1,
        3,
        0,
        1,
        1,
        3,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 12,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 19,
          "Player" : "Caio"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 67,
          "Player" : "Caio"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 84,
          "Player" : "Ayrton"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 1,
          "GT"     : 90,
          "Player" : "Serginho"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 31,
          "Player" : "Wilson"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 36,
          "Player" : "Vitor J."
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 37,
          "Player" : "Serginho"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 4,
          "Comp"   : 2,
          "GT"     : 43,
          "Player" : "Adriano"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 5,
          "Comp"   : 2,
          "GT"     : 62,
          "Player" : "Luiz Gustavo"
        },
        {
          "Type"   : 2,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 38,
          "Player" : "Mehdi Lacen"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 2,
      "HasTips"           : false,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 7,
              "PlayerName"     : "Paulo Baier",
              "PID"            : 85584,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 70,
              "SubstituteType" : 2,
              "PlayerNum"      : 1
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Galatto",
              "PID"            : 412473,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 14,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Bruno Saltor Grau",
              "PID"               : 479346,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 11,
              "SubstituteTime"    : 40,
              "SubstituteType"    : 1,
              "PlayerNum"         : 14
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Bruno Lopes",
              "PID"               : 401689,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 12,
              "SubstituteTime"    : 40,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Fabiano",
              "PID"               : 358014,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 7,
              "SubstituteTime"    : 70,
              "SubstituteType"    : 1,
              "PlayerNum"         : 16
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 7,
              "PlayerName"     : "Richarlyson",
              "PID"            : 358558,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 73,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"      : 8,
              "PlayerName"     : "Marcelo",
              "PID"            : 81912,
              "AthleteID"      : 30,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 46,
              "SubstituteType" : 2,
              "PlayerNum"      : 2
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Régis",
              "PID"            : 400740,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 83,
              "SubstituteType" : 2,
              "PlayerNum"      : 10
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Danilo Tarracha",
              "PID"               : 502314,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 8,
              "SubstituteTime"    : 46,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Dão",
              "PID"               : 484305,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 7,
              "SubstituteTime"    : 73,
              "SubstituteType"    : 1,
              "PlayerNum"         : 16
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Marcos",
              "PID"               : 350914,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 11,
              "SubstituteTime"    : 83,
              "SubstituteType"    : 1,
              "PlayerNum"         : 20
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 513390,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "26-07-2014 21:30",
      "Comps"             : [
        {
          "ID"   : 1213,
          "Name" : "Cruzeiro",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1214,
          "Name" : "Figueirense",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        5,
        0,
        1,
        0,
        5,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 12,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 2,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 41,
          "Player" : "Alejandro Silva"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 47,
          "Player" : "Marcos Aoás Correa"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 50,
          "Player" : "Dede"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 1,
          "GT"     : 72,
          "Player" : "Ricardo Goulart"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 5,
          "Comp"   : 1,
          "GT"     : 79,
          "Player" : "Dagoberto"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 33,
          "Player" : "Antonio"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 3,
              "PlayerName"     : "Ceará",
              "PID"            : 400839,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 72,
              "SubstituteType" : 2,
              "PlayerNum"      : 9
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "M. Moreno",
              "PID"            : 500167,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 69,
              "SubstituteType" : 2,
              "PlayerNum"      : 11
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Marcos Aoás Correa",
              "PID"            : 479267,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 67,
              "SubstituteType" : 2,
              "PlayerNum"      : 10
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Julio Baptista",
              "PID"               : 35340,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 67,
              "SubstituteType"    : 1,
              "PlayerNum"         : 21
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "M. Samudio",
              "PID"               : 487022,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 9,
              "SubstituteTime"    : 69,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Manoel",
              "PID"               : 350622,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 3,
              "SubstituteTime"    : 72,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 3,
              "PlayerName"     : "R. Cereceda",
              "PID"            : 487717,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 62,
              "SubstituteType" : 2,
              "PlayerNum"      : 1
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Pablo Infante",
              "PID"            : 329886,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 57,
              "SubstituteType" : 2,
              "PlayerNum"      : 7
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Luan Guilherme de Jesús Vieira",
              "PID"            : 479590,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 80,
              "SubstituteType" : 2,
              "PlayerNum"      : 11
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Cleitinho",
              "PID"               : 358540,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 9,
              "SubstituteTime"    : 57,
              "SubstituteType"    : 1,
              "PlayerNum"         : 17
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Dener",
              "PID"               : 462416,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 3,
              "SubstituteTime"    : 62,
              "SubstituteType"    : 1,
              "PlayerNum"         : 14
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Alex Santana",
              "PID"               : 398769,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 80,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 513394,
      "Comp"              : 113,
      "Season"            : 7,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "26-07-2014 21:30",
      "Comps"             : [
        {
          "ID"   : 1224,
          "Name" : "Santos",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 7387,
          "Name" : "Chapecoense",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        3,
        0,
        1,
        0,
        3,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 12,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 13,
          "Player" : "Rildo"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 52,
          "Player" : "Gabriel"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 81,
          "Player" : "Diego Cardoso Nogueira"
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 40,
          "Player" : "Biro R."
        },
        {
          "Type"   : 1,
          "SType"  : -1,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 60,
          "Player" : "Braz D."
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 8,
              "PlayerName"     : "Alison",
              "PID"            : 408155,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 86,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Thiago Ribeiro",
              "PID"            : 309626,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 83,
              "SubstituteType" : 2,
              "PlayerNum"      : 10
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Rildo",
              "PID"            : 393498,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 75,
              "SubstituteType" : 2,
              "PlayerNum"      : 3
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Alan Santos",
              "PID"               : 424834,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 75,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Diego Cardoso Nogueira",
              "PID"               : 470139,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 9,
              "SubstituteTime"    : 83,
              "SubstituteType"    : 1,
              "PlayerNum"         : 21
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Geuvânio",
              "PID"               : 482918,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 8,
              "SubstituteTime"    : 86,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 6,
              "PlayerName"     : "Camilo",
              "PID"            : 347955,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 67,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"      : 7,
              "PlayerName"     : "Ricardo Conceição",
              "PID"            : 361014,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 29,
              "SubstituteType" : 2,
              "PlayerNum"      : 6
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Neném",
              "PID"            : 508594,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 84,
              "SubstituteType" : 2,
              "PlayerNum"      : 10
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Aleks",
              "PID"               : 488137,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 7,
              "SubstituteTime"    : 29,
              "SubstituteType"    : 1,
              "PlayerNum"         : 13
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Fabinho Alves",
              "PID"               : 374981,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 6,
              "SubstituteTime"    : 67,
              "SubstituteType"    : 1,
              "PlayerNum"         : 14
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Leandro",
              "PID"               : 345537,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 84,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"     : 1,
      "ID"      : 513768,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "26-07-2014 19:20",
      "Comps"   : [
        {
          "ID"    : 5918,
          "Name"  : "Atletico Goianiense",
          "SName" : "Goianiense",
          "CID"   : 21,
          "SID"   : 1
        },
        {
          "ID"   : 1221,
          "Name" : "Nautico Recife",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        0,
        0,
        0,
        2,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 13,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 54,
          "Player" : "Júnior Viçosa"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 68,
          "Player" : "Andre Luis"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513772,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "26-07-2014 19:20",
      "Comps"   : [
        {
          "ID"   : 9147,
          "Name" : "Joinville",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1777,
          "Name" : "Avai",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        1,
        0,
        0,
        0,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 13,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 84,
          "Player" : "Santanac."
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 513773,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "26-07-2014 19:20",
      "Comps"   : [
        {
          "ID"   : 1266,
          "Name" : "Ponte Preta",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1227,
          "Name" : "Vasco Da Gama",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 13,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 542982,
      "Comp"    : 116,
      "Season"  : 3,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "26-07-2014 19:20",
      "Comps"   : [
        {
          "ID"   : 14154,
          "Name" : "Santa Cruz (PE)",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1781,
          "Name" : "Ceara",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        3,
        2,
        3,
        2,
        3,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 23,
          "Player" : "Bill"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 28,
          "Player" : "Wescley"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 30,
          "Player" : "Leo Gamalho"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 2,
          "GT"     : 40,
          "Player" : "Magno Alves"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 5,
          "Comp"   : 2,
          "GT"     : 46,
          "Player" : "Rafael van der Vaart"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514084,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "26-07-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 7073,
          "Name" : "Duque de Caxias",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9104,
          "Name" : "Tupi",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        1,
        0,
        0,
        1,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 8,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 56,
          "Player" : "Marcelinho"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514087,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "26-07-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 7064,
          "Name" : "Macae",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1771,
          "Name" : "Mogi Mirim",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        1,
        1,
        1,
        2,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 8,
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 38,
          "Player" : "Martin Wagner"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 45,
          "Player" : "Joao Carlos"
        },
        {
          "Type"   : 0,
          "SType"  : 2,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 77,
          "Player" : "Romário"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 543749,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "26-07-2014 19:00",
      "Comps"   : [
        {
          "ID"   : 10248,
          "Name" : "Tombense",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9176,
          "Name" : "Goianesia",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        4,
        0,
        0,
        0,
        4,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 63,
          "Player" : "Joao Paulo"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 514086,
      "Comp"    : 5518,
      "Season"  : 2,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "26-07-2014 18:00",
      "Comps"   : [
        {
          "ID"   : 1265,
          "Name" : "Guaratingueta",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1275,
          "Name" : "Sao Caetano",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"   : 8,
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 543752,
      "Comp"    : 5519,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "26-07-2014 18:00",
      "Comps"   : [
        {
          "ID"   : 20781,
          "Name" : "Boavista/Rj",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 20786,
          "Name" : "Ec Pelotas/Rs",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"               : 1,
      "ID"                : 513767,
      "Comp"              : 116,
      "Season"            : 3,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "26-07-2014 00:00",
      "Comps"             : [
        {
          "ID"   : 1783,
          "Name" : "América (RN)",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 8514,
          "Name" : "América Mineiro",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        1,
        0,
        1,
        0,
        1,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 13,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 36,
          "Player" : "Rodrigo Pimpo"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 7,
              "PlayerName"     : "Márcio Passos",
              "PID"            : 394843,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 73,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Rodrigo Pimpao",
              "PID"            : 393431,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 73,
              "SubstituteType" : 2,
              "PlayerNum"      : 7
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Dida",
              "PID"            : 352059,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 63,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Isac",
              "PID"               : 403286,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 11,
              "SubstituteTime"    : 63,
              "SubstituteType"    : 1,
              "PlayerNum"         : 21
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Thiago Santos",
              "PID"               : 501761,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 7,
              "SubstituteTime"    : 73,
              "SubstituteType"    : 1,
              "PlayerNum"         : 20
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Chris Vieira",
              "PID"               : 500834,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 7,
              "SubstituteTime"    : 73,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 6,
              "PlayerName"     : "Mancini",
              "PID"            : 270426,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 81,
              "SubstituteType" : 2,
              "PlayerNum"      : 1
            },
            {
              "JerseyNum"      : 8,
              "PlayerName"     : "Willians",
              "PID"            : 375350,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 82,
              "SubstituteType" : 2,
              "PlayerNum"      : 8
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Andrezinho",
              "PID"            : 365527,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 74,
              "SubstituteType" : 2,
              "PlayerNum"      : 6
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Eduardo",
              "PID"               : 27254,
              "AthleteID"         : 795,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 74,
              "SubstituteType"    : 1,
              "PlayerNum"         : 17
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "João Ricardo",
              "PID"               : 500832,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 6,
              "SubstituteTime"    : 81,
              "SubstituteType"    : 1,
              "PlayerNum"         : 13
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Júnior Lemos",
              "PID"               : 513777,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 8,
              "SubstituteTime"    : 82,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 513769,
      "Comp"              : 116,
      "Season"            : 3,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "26-07-2014 00:00",
      "Comps"             : [
        {
          "ID"   : 10247,
          "Name" : "Boa Esporte",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1273,
          "Name" : "Bragantino",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        2,
        1,
        0,
        0,
        2,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 13,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 50,
          "Player" : "Fernando Karanga"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 67,
          "Player" : "Luisinho"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 73,
          "Player" : "Fernando Karanga"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 7,
              "PlayerName"     : "Vinicius Hess",
              "PID"            : 501723,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 71,
              "SubstituteType" : 2,
              "PlayerNum"      : 7
            },
            {
              "JerseyNum"      : 8,
              "PlayerName"     : "Ualisson",
              "PID"            : 488842,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 77,
              "SubstituteType" : 2,
              "PlayerNum"      : 6
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Tomas",
              "PID"            : 528634,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 62,
              "SubstituteType" : 2,
              "PlayerNum"      : 11
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Ramos Borges Emerson",
              "PID"               : 368888,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 62,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Diego",
              "PID"               : 334844,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 7,
              "SubstituteTime"    : 71,
              "SubstituteType"    : 1,
              "PlayerNum"         : 20
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Emerson Santos",
              "PID"               : 516434,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 8,
              "SubstituteTime"    : 77,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 6,
              "PlayerName"     : "Magno Cruz",
              "PID"            : 386737,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 71,
              "SubstituteType" : 2,
              "PlayerNum"      : 6
            },
            {
              "JerseyNum"      : 8,
              "PlayerName"     : "Francesco",
              "PID"            : 430252,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 57,
              "SubstituteType" : 2,
              "PlayerNum"      : 7
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Rafael Defendi",
              "PID"            : 488931,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 64,
              "SubstituteType" : 2,
              "PlayerNum"      : 10
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Luan Guilherme de Jesús Vieira",
              "PID"               : 479590,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 8,
              "SubstituteTime"    : 57,
              "SubstituteType"    : 1,
              "PlayerNum"         : 14
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Graxa",
              "PID"               : 527433,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 9,
              "SubstituteTime"    : 64,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Muller",
              "PID"               : 340626,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 6,
              "SubstituteTime"    : 71,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 513774,
      "Comp"              : 116,
      "Season"            : 3,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "25-07-2014 22:30",
      "Comps"             : [
        {
          "ID"   : 1772,
          "Name" : "Oeste",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9191,
          "Name" : "Luverdense",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        2,
        1,
        0,
        1,
        2,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Round"             : 13,
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 34,
          "Player" : "Reinaldo"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 51,
          "Player" : "Reis"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 71,
          "Player" : "Serginho"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 3,
              "PlayerName"     : "César Gaúcho",
              "PID"            : 403715,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 14,
              "SubstituteType" : 2,
              "PlayerNum"      : 6
            },
            {
              "JerseyNum"      : 5,
              "PlayerName"     : "Ezequiel",
              "PID"            : 412376,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 85,
              "SubstituteType" : 2,
              "PlayerNum"      : 7
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Reis",
              "PID"            : 363696,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 69,
              "SubstituteType" : 2,
              "PlayerNum"      : 3
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Borebi",
              "PID"               : 482964,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 3,
              "SubstituteTime"    : 14,
              "SubstituteType"    : 1,
              "PlayerNum"         : 22
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Bruno Oliveira",
              "PID"               : 526705,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 69,
              "SubstituteType"    : 1,
              "PlayerNum"         : 18
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Cris",
              "PID"               : 290541,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 5,
              "SubstituteTime"    : 85,
              "SubstituteType"    : 1,
              "PlayerNum"         : 13
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 7,
              "PlayerName"     : "Washington",
              "PID"            : 73722,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 80,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"      : 8,
              "PlayerName"     : "Samuel Fernandez",
              "PID"            : 333778,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 79,
              "SubstituteType" : 2,
              "PlayerNum"      : 7
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Edimo Ferreira Campos",
              "PID"               : 479582,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 8,
              "SubstituteTime"    : 79,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Jean Patrick",
              "PID"               : 358528,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 7,
              "SubstituteTime"    : 80,
              "SubstituteType"    : 1,
              "PlayerNum"         : 14
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"               : 1,
      "ID"                : 542578,
      "Comp"              : 115,
      "Active"            : false,
      "STID"              : 3,
      "GT"                : 90,
      "GTD"               : "90'",
      "STime"             : "24-07-2014 22:30",
      "Comps"             : [
        {
          "ID"   : 1226,
          "Name" : "Sport Recife",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 7390,
          "Name" : "Paysandu",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"              : [
        3,
        2,
        3,
        2,
        3,
        2,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"            : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 3,
          "Player" : "Ananias"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 14,
          "Player" : "Danilo"
        },
        {
          "Type"   : 0,
          "SType"  : 1,
          "Num"    : 3,
          "Comp"   : 2,
          "GT"     : 18,
          "Player" : "Ewerton Páscoa"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 4,
          "Comp"   : 1,
          "GT"     : 41,
          "Player" : "Ananias"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 5,
          "Comp"   : 2,
          "GT"     : 43,
          "Player" : "Marcos Paraná"
        }
      ],
      "OnTV"              : false,
      "HasBets"           : false,
      "Winner"            : 1,
      "HasTips"           : false,
      "HasLineups"        : true,
      "HasFieldPositions" : false,
      "Lineups"           : [
        {
          "Players"           : [
            {
              "JerseyNum"      : 5,
              "PlayerName"     : "Erik",
              "PID"            : 488002,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 60,
              "SubstituteType" : 2,
              "PlayerNum"      : 10
            },
            {
              "JerseyNum"      : 9,
              "PlayerName"     : "Willian",
              "PID"            : 528897,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 56,
              "SubstituteType" : 2,
              "PlayerNum"      : 11
            },
            {
              "JerseyNum"      : 11,
              "PlayerName"     : "Felipe Azevedo",
              "PID"            : 355658,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 78,
              "SubstituteType" : 2,
              "PlayerNum"      : 5
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Wendel",
              "PID"               : 279165,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 9,
              "SubstituteTime"    : 56,
              "SubstituteType"    : 1,
              "PlayerNum"         : 20
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Aílton",
              "PID"               : 481797,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 5,
              "SubstituteTime"    : 60,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Mike",
              "PID"               : 278389,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 11,
              "SubstituteTime"    : 78,
              "SubstituteType"    : 1,
              "PlayerNum"         : 19
            }
          ],
          "CompNum"           : 1,
          "HasFieldPositions" : false
        },
        {
          "Players"           : [
            {
              "JerseyNum"      : 7,
              "PlayerName"     : "Augusto Recife",
              "PID"            : 516111,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 46,
              "SubstituteType" : 2,
              "PlayerNum"      : 7
            },
            {
              "JerseyNum"      : 8,
              "PlayerName"     : "Marcos Paraná",
              "PID"            : 345330,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 67,
              "SubstituteType" : 2,
              "PlayerNum"      : 4
            },
            {
              "JerseyNum"      : 10,
              "PlayerName"     : "Ricardo Capanema",
              "PID"            : 527967,
              "Position"       : 0,
              "Status"         : 1,
              "SubstituteTime" : 80,
              "SubstituteType" : 2,
              "PlayerNum"      : 11
            },
            {
              "JerseyNum"         : 12,
              "PlayerName"        : "Marcus Vinicius",
              "PID"               : 364325,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 7,
              "SubstituteTime"    : 46,
              "SubstituteType"    : 1,
              "PlayerNum"         : 13
            },
            {
              "JerseyNum"         : 13,
              "PlayerName"        : "Héverton",
              "PID"               : 527945,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 8,
              "SubstituteTime"    : 67,
              "SubstituteType"    : 1,
              "PlayerNum"         : 12
            },
            {
              "JerseyNum"         : 14,
              "PlayerName"        : "Alves Fabinho",
              "PID"               : 397623,
              "Position"          : 0,
              "Status"            : 2,
              "SubstitutedPlayer" : 10,
              "SubstituteTime"    : 80,
              "SubstituteType"    : 1,
              "PlayerNum"         : 15
            }
          ],
          "CompNum"           : 2,
          "HasFieldPositions" : false
        }
      ]
    },
    {
      "SID"     : 1,
      "ID"      : 542513,
      "Comp"    : 115,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "24-07-2014 01:00",
      "Comps"   : [
        {
          "ID"   : 14154,
          "Name" : "Santa Cruz (PE)",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9203,
          "Name" : "Botafogo (PB)",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        2,
        1,
        1,
        1,
        2,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 22,
          "Player" : "Leo Gamalho"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 45,
          "Player" : "Lenilson"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 77,
          "Player" : "Leo Gamalho"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 542521,
      "Comp"    : 115,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "24-07-2014 01:00",
      "Comps"   : [
        {
          "ID"   : 1266,
          "Name" : "Ponte Preta",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1227,
          "Name" : "Vasco Da Gama",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        2,
        0,
        0,
        0,
        2,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 56,
          "Player" : "Diego Renan"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 62,
          "Player" : "Thalles"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 542522,
      "Comp"    : 115,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "24-07-2014 01:00",
      "Comps"   : [
        {
          "ID"   : 1267,
          "Name" : "Corinthians",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1767,
          "Name" : "Bahia",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        3,
        0,
        2,
        0,
        3,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 18,
          "Player" : "Elias"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 1,
          "GT"     : 33,
          "Player" : "Lucas Daniel Romero"
        },
        {
          "Type"   : 0,
          "SType"  : 2,
          "Num"    : 3,
          "Comp"   : 1,
          "GT"     : 90,
          "Player" : "Augusto R."
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 542381,
      "Comp"    : 115,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "23-07-2014 22:30",
      "Comps"   : [
        {
          "ID"   : 1781,
          "Name" : "Ceara",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 7387,
          "Name" : "Chapecoense",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        1,
        1,
        1,
        1,
        1,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 35,
          "Player" : "Eduardo"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 46,
          "Player" : "Leandro"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : -1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 542515,
      "Comp"    : 115,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "23-07-2014 22:30",
      "Comps"   : [
        {
          "ID"   : 1776,
          "Name" : "ABC",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 9092,
          "Name" : "Novo Hamburgo",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        1,
        0,
        0,
        0,
        1,
        0,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 2,
          "Num"    : 1,
          "Comp"   : 1,
          "GT"     : 94,
          "Player" : "Silvar."
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 1,
      "HasTips" : false
    },
    {
      "SID"     : 1,
      "ID"      : 542517,
      "Comp"    : 115,
      "Active"  : false,
      "STID"    : 3,
      "GT"      : 90,
      "GTD"     : "90'",
      "STime"   : "23-07-2014 22:30",
      "Comps"   : [
        {
          "ID"   : 1777,
          "Name" : "Avai",
          "CID"  : 21,
          "SID"  : 1
        },
        {
          "ID"   : 1222,
          "Name" : "Palmeiras",
          "CID"  : 21,
          "SID"  : 1
        }
      ],
      "Scrs"    : [
        0,
        2,
        0,
        0,
        0,
        2,
        -1,
        -1,
        -1,
        -1
      ],
      "Events"  : [
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 1,
          "Comp"   : 2,
          "GT"     : 63,
          "Player" : "Felipe Menezes"
        },
        {
          "Type"   : 0,
          "SType"  : 0,
          "Num"    : 2,
          "Comp"   : 2,
          "GT"     : 71,
          "Player" : "Felipe Menezes"
        }
      ],
      "OnTV"    : false,
      "HasBets" : false,
      "Winner"  : 2,
      "HasTips" : false
    }
  ],
  "Competitions"      : [
    {
      "Name"       : "Serie A",
      "ID"         : 113,
      "CID"        : 21,
      "SID"        : 1,
      "HasTbl"     : true,
      "OrderLevel" : 1,
      "Seasons"    : [
        {
          "Num"     : 7,
          "Name"    : "2014",
          "UseName" : false,
          "HasTbl"  : true
        }
      ],
      "CurrSeason" : 7
    },
    {
      "Name"       : "Serie B",
      "ID"         : 116,
      "CID"        : 21,
      "SID"        : 1,
      "HasTbl"     : true,
      "OrderLevel" : 2,
      "Seasons"    : [
        {
          "Num"     : 3,
          "Name"    : "2014",
          "UseName" : false,
          "HasTbl"  : true
        }
      ],
      "CurrSeason" : 3
    },
    {
      "Name"       : "Copa do Brasil",
      "ID"         : 115,
      "CID"        : 21,
      "SID"        : 1,
      "HasTbl"     : false,
      "OrderLevel" : 2
    },
    {
      "Name"       : "Serie C",
      "ID"         : 5518,
      "CID"        : 21,
      "SID"        : 1,
      "HasTbl"     : true,
      "OrderLevel" : 10,
      "Seasons"    : [
        {
          "Num"     : 2,
          "Name"    : " ",
          "UseName" : false,
          "HasTbl"  : true,
          "Stages"  : [
            {
              "Num"     : 1,
              "Name"    : "Group Stage",
              "UseName" : false,
              "HasTbl"  : true,
              "Groups"  : [
                {
                  "Num"     : 1,
                  "Name"    : "Group A",
                  "UseName" : true,
                  "HasTbl"  : true
                },
                {
                  "Num"     : 2,
                  "Name"    : "Group B",
                  "UseName" : true,
                  "HasTbl"  : true
                }
              ],
              "IsFinal" : false
            }
          ]
        }
      ],
      "CurrSeason" : 2,
      "CurrStage"  : 1
    },
    {
      "Name"       : "Serie D",
      "ID"         : 5519,
      "CID"        : 21,
      "SID"        : 1,
      "HasTbl"     : false,
      "OrderLevel" : 10
    }
  ],
  "Countries"         : [
    {
      "Name" : "Brazil",
      "ID"   : 21
    }
  ],
  "RequestedUpdateID" : -1,
  "CurrentDate"       : "06-08-2014",
  "TTL"               : 10
});