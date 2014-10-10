'use strict';
var VError, mongoose, nconf, request, async, slug, championships, teams, flags, Championship, Match, Team, now, today;

VError = require('verror');
mongoose = require('mongoose');
nconf = require('nconf');
request = require('request');
async = require('async');
slug = require('slug');
Championship = require('../models/championship');
Match = require('../models/match');
Team = require('../models/team');

nconf.argv();
nconf.env();
nconf.defaults(require('../config'));

now = new Date();
today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

championships = [
  {
    'name'               : 'Premier League',
    'country'            : 'United Kingdom',
    'type'               : 'national league',
    'picture'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099445/England_pu515s.png',
    'edition'            : 2014,
    'rounds'             : 38,
    '365scoresCountryId' : 1,
    '365scoresCompId'    : 7
  },
  {
    'name'               : 'Primera División',
    'country'            : 'Spain',
    'type'               : 'national league',
    'picture'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099446/Spain_fbtjci.png',
    'edition'            : 2014,
    'rounds'             : 38,
    '365scoresCountryId' : 2,
    '365scoresCompId'    : 11
  },
  {
    'name'               : 'Serie A',
    'country'            : 'Italy',
    'type'               : 'national league',
    'picture'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099445/Italy_jn9gec.png',
    'edition'            : 2014,
    'rounds'             : 38,
    '365scoresCountryId' : 3,
    '365scoresCompId'    : 17
  },
  {
    'name'               : 'Bundesliga',
    'country'            : 'Germany',
    'type'               : 'national league',
    'picture'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099445/Germany_ogmgq3.png',
    'edition'            : 2014,
    'rounds'             : 38,
    '365scoresCountryId' : 4,
    '365scoresCompId'    : 25
  },
  {
    'name'               : 'Ligue 1',
    'country'            : 'France',
    'type'               : 'national league',
    'picture'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099445/France_kc8cke.png',
    'edition'            : 2014,
    'rounds'             : 38,
    '365scoresCountryId' : 5,
    '365scoresCompId'    : 35
  },
  {
    'name'               : 'Primeira Liga',
    'country'            : 'Portugal',
    'type'               : 'national league',
    'picture'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099445/Portugal_j8oclj.png',
    'edition'            : 2014,
    'rounds'             : 38,
    '365scoresCountryId' : 11,
    '365scoresCompId'    : 73
  },
  {
    'name'               : 'Série A',
    'country'            : 'Brazil',
    'type'               : 'national league',
    'picture'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099445/Brazil_b4izf9.png',
    'edition'            : 2014,
    'rounds'             : 38,
    '365scoresCountryId' : 21,
    '365scoresCompId'    : 113
  },
  {
    'name'               : 'Primera División',
    'country'            : 'Argentina',
    'type'               : 'national league',
    'picture'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099445/Argentina_o4arz3.png',
    'edition'            : 2014,
    'rounds'             : 38,
    '365scoresCountryId' : 10,
    '365scoresCompId'    : 72
  },
  {
    'name'               : 'MLS',
    'country'            : 'United States',
    'type'               : 'national league',
    'picture'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099446/USA_pnjeel.png',
    'edition'            : 2014,
    'rounds'             : 38,
    '365scoresCountryId' : 18,
    '365scoresCompId'    : 104
  },
  {
    'name'               : 'Champions League',
    'country'            : 'Europe',
    'type'               : 'continental league',
    'picture'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1412904170/Europe_r12tpr.png',
    'edition'            : 2014,
    'rounds'             : 38,
    '365scoresCountryId' : 19,
    '365scoresCompId'    : 572
  }
];

flags = {
  'West Ham'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101121/West_Ham_spvp4u.png',
  'West Bromwich'          : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101121/W_Bromwich_glhhii.png',
  'Tottenham'              : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101121/Tottenham_hull4p.png',
  'Swansea'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101121/Swansea_bndhhr.png',
  'Sunderland'             : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101121/Sunderland_vqlb9l.png',
  'Stoke'                  : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101121/Stoke_wt1cqa.png',
  'Southampton'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101121/Southampton_fdmgzm.png',
  'Queens P.R.'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101121/Queens_P_R_pklu67.png',
  'Newcastle'              : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101121/Newcastle_k7tvxy.png',
  'Manchester United'      : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101121/Man_United_oyhawt.png',
  'Manchester City'        : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101120/Man_City_t5zktu.png',
  'Liverpool'              : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101121/Liverpool_jtt9xv.png',
  'Leicester'              : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101120/Leicester_eipa0n.png',
  'Hull'                   : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101120/Hull_sz9jvd.png',
  'Everton'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101120/Everton_jncyk9.png',
  'Crystal Palace'         : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101120/Crystal_Palace_jkoyyp.png',
  'Chelsea'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101120/Chelsea_fgmj6e.png',
  'Burnley'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101120/Burnley_r5dclo.png',
  'Aston Villa'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101120/Aston_Villa_tvdxdq.png',
  'Arsenal'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101120/Arsenal_dgfvkq.png',
  'Almeria'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101388/Almeria_ndwnxr.png',
  'Athletic Bilbao'        : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101388/Athl_Bilbao_cwwlk1.png',
  'Atlético Madrid'        : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101388/Atl_Madrid_ufcq5h.png',
  'Barcelona'              : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101388/Barcelona_e0gst4.png',
  'Celta Vigo'             : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101388/Celta_Vigo_kyynqo.png',
  'Cordoba'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101389/Cordoba_g5cko4.png',
  'Deportivo La Coruna'    : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101389/D_La_Coruna_xmpfix.png',
  'Eibar'                  : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101389/Eibar_qmyhd8.png',
  'Elche'                  : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101389/Elche_vyjj1k.png',
  'Espanyol'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101389/Espanyol_wqdiy7.png',
  'Getafe'                 : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101389/Getafe_eartcd.png',
  'Granada'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101389/Granada_vlfdta.png',
  'Levante'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101391/Levante_wqsaem.png',
  'Malaga'                 : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101389/Malaga_vku66n.png',
  'Rayo Vallecano'         : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101389/R_Vallecano_pfi70y.png',
  'Real Madrid'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101391/Real_Madrid_f0exyy.png',
  'Real Sociedad'          : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101390/Real_Sociedad_hg3xft.png',
  'Sevilla'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101390/Sevilla_sfacg2.png',
  'Valencia'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101390/Valencia_kxfvz2.png',
  'Villarreal'             : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101390/Villareal_t5lzp7.png',
  'AC Milan'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101640/Milan_hmjnjg.png',
  'AS Roma'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101640/AS_Roma_un3yfd.png',
  'Atalanta'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101639/Atalanta_itaoc4.png',
  'Cagliari'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101639/Cagliari_zwvpie.png',
  'Cesena'                 : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101639/Cesena_hxrme6.png',
  'Chievo'                 : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101639/Chievo_ptgjff.png',
  'Empoli'                 : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101639/Empoli_zoiwmy.png',
  'Fiorentina'             : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101640/Fiorentina_v2g7nj.png',
  'Genoa'                  : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101640/Genoa_qwj0ne.png',
  'Inter Milan'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101640/Internazionale_jnth0u.png',
  'Juventus'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101640/Juventus_ce7cb8.png',
  'Lazio'                  : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101640/Lazio-Roma_j8exr7.png',
  'Napoli'                 : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101640/Napoli_hk6qmb.png',
  'Palermo'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101640/Palermo_efaldz.png',
  'Parma'                  : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101640/Parma_d5s8gb.png',
  'Sampdoria'              : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101640/Sampdoria_d4mghs.png',
  'Sassuolo'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101641/Sassuolo_cxnu9i.png',
  'Torino'                 : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101641/Torino_cvnt46.png',
  'Udinese'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101641/Udinese_ayqxme.png',
  'Verona'                 : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101641/Verona_oyskc7.png',
  'Bayern Munich'          : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099818/B_M%C3%BCnchen_sunmv7.png',
  'Bor. Dortmund'          : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099818/Bor_Dortmund_ih2dc2.png',
  'Eintracht Frankfurt'    : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099818/E_Frankfurt_iueuww.png',
  'Hertha Berlin'          : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099819/Hertha_mx4k6h.png',
  'Augsburg'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099818/Augsburg_h3mowp.png',
  'Bayer Leverkusen'       : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099818/B_Leverkusen_rscohi.png',
  'Bor. Monchengladbach'   : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099818/B_M%C3%B6nchengladbach_ixcmyw.png',
  'FC Koln'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099818/FC_Koln_bnd0vc.png',
  'Freiburg'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099818/Freiburg_dmkm1f.png',
  'Hamburger SV'           : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099818/Hamburger_xlaysz.png',
  'Hannover'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099818/Hannover_96_zeklnp.png',
  'Hoffenheim'             : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099820/Hoffenheim_lvn4dx.png',
  'Mainz 05'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099819/Mainz_05_dzta3a.png',
  'Paderborn'              : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099819/Paderborn_qzzfxi.png',
  'Schalke 04'             : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099819/Schalke_04_tqk2pa.png',
  'Stuttgart'              : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099819/Stuttgart_zfoyhh.png',
  'Werder Bremen'          : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099819/W_Bremen_qh7qef.png',
  'Wolfsburg'              : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409099819/Wolfsburg_s4ydck.png',
  'Bastia'                 : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100641/Bastia_pvuvz7.png',
  'Bordeaux'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100641/Bordeaux_ijcxmf.png',
  'Caen'                   : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100641/Caen_toducw.png',
  'Evian Tgfc'             : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100641/Evian_zhivv5.png',
  'Guingamp'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100641/Guingamp_yzlnsc.png',
  'Lens'                   : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100641/Lens_jx3zvt.png',
  'Lille'                  : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100641/Lille_ersydj.png',
  'Lorient'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100641/Lorient_ayth0o.png',
  'Lyon'                   : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100641/Lyon_swpbnb.png',
  'Marseille'              : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100641/Marseille_y7wxws.png',
  'Metz'                   : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100641/Metz_cykqou.png',
  'Monaco'                 : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100642/Monaco_a0wvla.png',
  'Montpellier'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100642/Montpellier_dguvij.png',
  'Nantes'                 : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100642/Nantes_f0jhdr.png',
  'Nice'                   : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100642/Nice_lpy27v.png',
  'Paris-SG'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100642/Paris_SG_sxbn6o.png',
  'Reims'                  : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100642/Reims_ub2yxb.png',
  'Rennes'                 : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100642/Rennes_gpnize.png',
  'Saint-Éttiene'          : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100642/Saint_%C3%89tienne_ujocxh.png',
  'Toulouse'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100642/Toulouse_i918ff.png',
  'Academica'              : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100287/Acad%C3%A9mica_yidjau.png',
  'Arouca'                 : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100288/Arouca_unthcq.png',
  'Belenenses'             : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100287/Belenenses_qx0t7q.png',
  'Benfica'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100287/Benfica_qbxf1j.png',
  'Boavista'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100287/Boavista_xen8ed.png',
  'Braga'                  : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100287/Braga_fh1u0m.png',
  'Estoril'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100288/Estoril_yrkadq.png',
  'Gil Vicente'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100288/Gil_Vicente_gyk4di.png',
  'Maritimo'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100288/Maritimo_ouvbhe.png',
  'Moreirense'             : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100288/Moreirense_zyknad.png',
  'Nacional Madeira'       : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100288/Nacional_bgksi8.png',
  'Paços Ferreira'         : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100288/P_Ferreira_hvlhbs.png',
  'Penafiel'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100288/Penafiel_kugle8.png',
  'FC Porto'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100288/Porto_q0svmv.png',
  'Rio Ave'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100288/Rio_Ave_xbvqtn.png',
  'Sporting'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100288/Sporting_bweacc.png',
  'Guimaraes'              : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100288/V_Guimar%C3%A3es_btdzgy.png',
  'Setubal'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409100289/V_Set%C3%BAbal_jx4wsl.png',
  'Atletico Mineiro'       : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272811/Atle%C3%8C_tico_Mineiro_dftper.png',
  'Atletico Paranaense'    : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272811/Atle%C3%8C_tico_Paranaense_kk4axt.png',
  'Bahia'                  : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272812/Bahia_lkkknx.png',
  'Botafogo'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272811/Botafogo_tugfzp.png',
  'Chapecoense'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272812/Chapecoense_jeyde9.png',
  'Corinthians'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272817/Corinthians_pwfida.png',
  'Coritiba'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272813/Coritiba_gmhywc.png',
  'Criciuma'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272812/Criciu%C3%8C_ma_yk0duw.png',
  'Cruzeiro'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272814/Cruzeiro_sh1kop.png',
  'Figueirense'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272813/Figueirense_iu4ain.png',
  'Flamengo'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272813/Flamengo_bjdujv.png',
  'Fluminense'             : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272814/Fluminense_nhyvvj.png',
  'Goias'                  : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272814/Goia%C3%8C_s_madl9c.png',
  'Gremio'                 : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272817/Gre%C3%8C_mio_dczosn.png',
  'Internacional'          : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272816/Internacional_ya1tgj.png',
  'Palmeiras'              : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272816/Palmeiras_kjifsh.png',
  'Santos'                 : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272819/Santos_aql4v8.png',
  'Sao Paulo'              : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272818/Sa%C3%8C_o_Paulo_qojwyh.png',
  'Sport Recife'           : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272817/Sport_zdztry.png',
  'Vitoria'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1405272817/Vito%C3%8C_ria_v8zequ.png',
  'Arsenal Sarandi'        : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102255/Arsenal_Sar_howgpz.png',
  'Atletico Rafaela'       : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102255/Atl_Rafaela_gwj383.png',
  'Banfield'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102255/Banfield_i61ful.png',
  'Belgrano'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102255/Belgrano_kbr62g.png',
  'Boca Juniors'           : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102255/Boca_Juniors_awqkrf.png',
  'Defensa Y Justicia'     : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102255/Defensa_Y_J_nzlvxs.png',
  'Estudiantes'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102255/Estudiantes_mraz7p.png',
  'Gimnasia Lp'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102255/Gimnasia_Lp_edlrrb.png',
  'Godoy Cruz'             : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102255/Godoy_Cruz_oxlrfg.png',
  'Independiente'          : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102256/Independiente_gfhou1.png',
  'Lanus'                  : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102255/Lan%C3%BAs_imho9r.png',
  'Newells Ob'             : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102256/Newells_O_B_ku12u7.png',
  'Olimpo de Bahia Blanca' : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102256/Olimpo_loun5i.png',
  'Quilmes'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102256/Quilmes_nkkcgv.png',
  'Racing Club'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102256/Racing_t4qpm4.png',
  'River Plate'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102256/River_Plate_iryqqv.png',
  'Rosario Central'        : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102256/Rosario_Cen_vilh8l.png',
  'San Lorenzo'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102256/San_Lorenzo_xlimwp.png',
  'Tigre'                  : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102256/Tigre_m8qara.png',
  'Velez Sarsfield'        : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409102257/Velez_Sarsf_aerkms.png',
  'Chicago Fire'           : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101922/Chicago_F_ztvwhm.png',
  'Chivas USA'             : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101922/Chivas_USA_ytatel.png',
  'Colorado Rapids'        : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101922/Colorado_R_vuz3sy.png',
  'Columbus Crew'          : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101922/Columbus_C_wci7ry.png',
  'DC United'              : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101923/DC_United_xgeyee.png',
  'FC Dallas'              : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101922/FC_Dallas_sxpeyu.png',
  'Houston Dynamo'         : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101924/Houston_D_zgwkge.png',
  'Los Angeles Galaxy'     : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101923/LA_Galaxy_hbr7ig.png',
  'Montreal Impact'        : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101923/Montreal_I_exkynh.png',
  'New York Red Bulls'     : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101923/NY_Red_Bulls_ux31ke.png',
  'New England Revol.'     : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101923/N_England_R_ftwfnt.png',
  'Philadelphia Union'     : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101923/Philadelphia_U_ugr4bu.png',
  'Portland Timbers'       : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101925/Portland_T_o1zc5y.png',
  'Real Salt Lake'         : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101923/R_Salt_Lake_l2y2tj.png',
  'San Jose'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101923/San_Jose_E_hzyiig.png',
  'Seattle Sounders'       : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101923/Seattle_S_lqxihr.png',
  'Sporting Kansas City'   : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101924/S_Kansas_C_qlgtow.png',
  'Toronto FC'             : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101923/Toronto_FC_dqrnn8.png',
  'Vancouver Whitecaps'    : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1409101924/Vancouver_W_iaz3ht.png',
  'Ajax'                   : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1412904842/Ajax_sidxdc.png',
  'RSC Anderlecht'         : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1412904873/Anderlecht_ad7tfx.png',
  'Apoel Nicosia'          : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1412904890/Apoel_lfvxtq.png',
  'Basel'                  : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1412904905/Basel_heqrom.png',
  'Bate Borisov'           : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1412904924/Bate_y6eg94.png',
  'CSKA Moscow'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1412904943/CSKA_Moscow_gervsg.png',
  'Galatasaray'            : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1412904978/Galatasaray_o3mhqe.png',
  'Ludogorets'             : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1412904995/Ludogorets_z1bn9v.png',
  'Malmo FF'               : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1412905010/Malmo_qx8gtm.png',
  'Maribor'                : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1412905028/Maribor_bwpugd.png',
  'Olympiakos'             : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1412905045/Olympiacos_ogiyfm.png',
  'Shakhter Donetsk'       : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1412905074/Shakhtar_Don_fc63id.png',
  'Zenit Petersburg'       : 'http://res.cloudinary.com/hivstsgwo/image/upload/c_scale,w_180/v1412905091/Zenit_e3w6mh.png'
};

teams = {
  'West Ham'               : 'West Ham',
  'West Bromwich'          : 'W. Bromwich',
  'Tottenham'              : 'Tottenham',
  'Swansea'                : 'Swansea',
  'Sunderland'             : 'Sunderland',
  'Stoke'                  : 'Stoke',
  'Southampton'            : 'Southampton',
  'Queens P.R.'            : 'Queens P.R.',
  'Newcastle'              : 'Newcastle',
  'Manchester United'      : 'Manch. Utd',
  'Manchester City'        : 'Manch. City',
  'Liverpool'              : 'Liverpool',
  'Leicester'              : 'Leicester',
  'Hull'                   : 'Hull',
  'Everton'                : 'Everton',
  'Crystal Palace'         : 'Crystal Palace',
  'Chelsea'                : 'Chelsea',
  'Burnley'                : 'Burnley',
  'Aston Villa'            : 'Aston Villa',
  'Arsenal'                : 'Arsenal',
  'Almeria'                : 'Almeria',
  'Athletic Bilbao'        : 'Athl. Bilbao',
  'Atlético Madrid'        : 'Atl. Madrid',
  'Barcelona'              : 'Barcelona',
  'Celta Vigo'             : 'Celta Vigo',
  'Cordoba'                : 'Cordoba',
  'Deportivo La Coruna'    : 'D. La Coruna',
  'Eibar'                  : 'Eibar',
  'Elche'                  : 'Elche',
  'Espanyol'               : 'Espanyol',
  'Getafe'                 : 'Getafe',
  'Granada'                : 'Granada',
  'Levante'                : 'Levante',
  'Malaga'                 : 'Malaga',
  'Rayo Vallecano'         : 'R. Vallecano',
  'Real Madrid'            : 'Real Madrid',
  'Real Sociedad'          : 'Real Sociedad',
  'Sevilla'                : 'Sevilla',
  'Valencia'               : 'Valencia',
  'Villarreal'             : 'Villarreal',
  'AC Milan'               : 'AC Milan',
  'AS Roma'                : 'AS Roma',
  'Atalanta'               : 'Atalanta',
  'Cagliari'               : 'Cagliari',
  'Cesena'                 : 'Cesena',
  'Chievo'                 : 'Chievo',
  'Empoli'                 : 'Empoli',
  'Fiorentina'             : 'Fiorentina',
  'Genoa'                  : 'Genoa',
  'Inter Milan'            : 'Inter Milan',
  'Juventus'               : 'Juventus',
  'Lazio'                  : 'Lazio',
  'Napoli'                 : 'Napoli',
  'Palermo'                : 'Palermo',
  'Parma'                  : 'Parma',
  'Sampdoria'              : 'Sampdoria',
  'Sassuolo'               : 'Sassuolo',
  'Torino'                 : 'Torino',
  'Udinese'                : 'Udinese',
  'Verona'                 : 'Verona',
  'Bayern Munich'          : 'B. Munich',
  'Bor. Dortmund'          : 'B. Dortmund',
  'Eintracht Frankfurt'    : 'E. Frankfurt',
  'Hertha Berlin'          : 'Hertha Berlin',
  'Augsburg'               : 'Augsburg',
  'Bayer Leverkusen'       : 'B. Leverkusen',
  'Bor. Monchengladbach'   : 'B. Monchen.',
  'FC Koln'                : 'FC Koln',
  'Freiburg'               : 'Freiburg',
  'Hamburger SV'           : 'Hamburger',
  'Hannover'               : 'Hannover',
  'Hoffenheim'             : 'Hoffenheim',
  'Mainz 05'               : 'Mainz 05',
  'Paderborn'              : 'Paderborn',
  'Schalke 04'             : 'Schalke 04',
  'Stuttgart'              : 'Stuttgart',
  'Werder Bremen'          : 'W. Bremen',
  'Wolfsburg'              : 'Wolfsburg',
  'Bastia'                 : 'Bastia',
  'Bordeaux'               : 'Bordeaux',
  'Caen'                   : 'Caen',
  'Evian Tgfc'             : 'Evian',
  'Guingamp'               : 'Guingamp',
  'Lens'                   : 'Lens',
  'Lille'                  : 'Lille',
  'Lorient'                : 'Lorient',
  'Lyon'                   : 'Lyon',
  'Marseille'              : 'Marseille',
  'Metz'                   : 'Metz',
  'Monaco'                 : 'Monaco',
  'Montpellier'            : 'Montpellier',
  'Nantes'                 : 'Nantes',
  'Nice'                   : 'Nice',
  'Paris-SG'               : 'Paris SG',
  'Reims'                  : 'Reims',
  'Rennes'                 : 'Rennes',
  'Saint-Éttiene'          : 'Saint-Éttiene',
  'Toulouse'               : 'Toulouse',
  'Academica'              : 'Académica',
  'Arouca'                 : 'Arouca',
  'Belenenses'             : 'Belenenses',
  'Benfica'                : 'Benfica',
  'Boavista'               : 'Boavista',
  'Braga'                  : 'Braga',
  'Estoril'                : 'Estoril',
  'Gil Vicente'            : 'Gil Vicente',
  'Maritimo'               : 'Marítimo',
  'Moreirense'             : 'Moreirense',
  'Nacional Madeira'       : 'Nacional',
  'Paços Ferreira'         : 'P. Ferreira',
  'Penafiel'               : 'Penafiel',
  'FC Porto'               : 'Porto',
  'Rio Ave'                : 'Rio Ave',
  'Sporting'               : 'Sporting',
  'Guimaraes'              : 'V. Guimarães',
  'Setubal'                : 'V. Setúbal',
  'Atletico Mineiro'       : 'Atlético MG',
  'Atletico Paranaense'    : 'Atlético PR',
  'Bahia'                  : 'Bahia',
  'Botafogo'               : 'Botafogo',
  'Chapecoense'            : 'Chapecoense',
  'Corinthians'            : 'Corinthians',
  'Coritiba'               : 'Coritiba',
  'Criciuma'               : 'Criciúma',
  'Cruzeiro'               : 'Cruzeiro',
  'Figueirense'            : 'Figueirense',
  'Flamengo'               : 'Flamengo',
  'Fluminense'             : 'Fluminense',
  'Goias'                  : 'Goiás',
  'Gremio'                 : 'Grêmio',
  'Internacional'          : 'Internacional',
  'Palmeiras'              : 'Palmeiras',
  'Santos'                 : 'Santos',
  'Sao Paulo'              : 'São Paulo',
  'Sport Recife'           : 'Sport',
  'Vitoria'                : 'Vitória',
  'Arsenal Sarandi'        : 'Arsenal Sar.',
  'Atletico Rafaela'       : 'Atl. Rafaela',
  'Banfield'               : 'Banfield',
  'Belgrano'               : 'Belgrano',
  'Boca Juniors'           : 'Boca Juniors',
  'Defensa Y Justicia'     : 'Defensa Y J.',
  'Estudiantes'            : 'Estudiantes',
  'Gimnasia Lp'            : 'Gimnasia Lp',
  'Godoy Cruz'             : 'Godoy Cruz',
  'Independiente'          : 'Independiente',
  'Lanus'                  : 'Lanus',
  'Newells Ob'             : 'Newells Ob',
  'Olimpo de Bahia Blanca' : 'Olimpo',
  'Quilmes'                : 'Quilmes',
  'Racing Club'            : 'Racing Club',
  'River Plate'            : 'River Plate',
  'Rosario Central'        : 'Rosario Cen.',
  'San Lorenzo'            : 'San Lorenzo',
  'Tigre'                  : 'Tigre',
  'Velez Sarsfield'        : 'Velez Sarsf.',
  'Chicago Fire'           : 'Chicago F.',
  'Chivas USA'             : 'Chivas USA',
  'Colorado Rapids'        : 'Colorado R.',
  'Columbus Crew'          : 'Columbus C.',
  'DC United'              : 'DC United',
  'FC Dallas'              : 'FC Dallas',
  'Houston Dynamo'         : 'Houston D.',
  'Los Angeles Galaxy'     : 'LA Galaxy',
  'Montreal Impact'        : 'Montreal I.',
  'New York Red Bulls'     : 'NY Red Bulls',
  'New England Revol.'     : 'N. England R.',
  'Philadelphia Union'     : 'Philadelphia U.',
  'Portland Timbers'       : 'Portland T.',
  'Real Salt Lake'         : 'R. Salt Lake',
  'San Jose'               : 'San Jose E.',
  'Seattle Sounders'       : 'Seattle S.',
  'Sporting Kansas City'   : 'S. Kansas C.',
  'Toronto FC'             : 'Toronto FC',
  'Vancouver Whitecaps'    : 'Vancouver W.',
  'Ajax'                   : 'Ajax',
  'RSC Anderlecht'         : 'Anderlecht',
  'Apoel Nicosia'          : 'Apoel',
  'Basel'                  : 'Basel',
  'Bate Borisov'           : 'Bate Borisov',
  'CSKA Moscow'            : 'CSKA Moscow',
  'Galatasaray'            : 'Galatasaray',
  'Ludogorets'             : 'Ludogorets',
  'Malmo FF'               : 'Malmo FF',
  'Maribor'                : 'Maribor',
  'Olympiakos'             : 'Olympiakos',
  'Shakhter Donetsk'       : 'Shakhter Donetsk',
  'Zenit Petersburg'       : 'Zenit Petersburg'
};

module.exports = function (next) {
  async.map(championships, function (championship, next) {
    async.waterfall([function (next) {
      Championship.findOneAndUpdate({
        'name'    : championship.name,
        'country' : championship.country,
        'type'    : championship.type,
        'edition' : championship.edition
      }, {'$set' : {
        'slug'    : slug(championship.name) + '-' + slug(championship.country) + '-' + championship.edition,
        'name'    : championship.name,
        'country' : championship.country,
        'type'    : championship.type,
        'picture' : championship.picture,
        'edition' : championship.edition,
        'rounds'  : championship.rounds
      }}, {'upsert' : true}, next);
    }, function (champ, next) {
      championship._id = champ._id;
      request('http://ws.365scores.com?action=1&Sid=1&curr_season=true&CountryID=' + championship['365scoresCountryId'], next);
    }, function (response, body, next) {
      var matches;
      matches = JSON.parse(body).Games || [];
      async.each(matches.filter(function (match) {
        return match.Comp === championship['365scoresCompId'];
      }), function (data, next) {
        var guest, guestId, host, hostId, round, dateMask, date, finished, elapsed, guestScore, hostScore;
        host = teams[data.Comps[0].Name];
        guest = teams[data.Comps[1].Name];
        round = data.Round || 1;
        dateMask = data.STime.split(/-|\s|:/).map(Number);
        date = new Date(dateMask[2], dateMask[1] - 1, dateMask[0], dateMask[3], dateMask[4]);
        finished = !data.Active && data.GT !== -1;
        elapsed = data.Active ? data.GT : null;
        hostScore = (data.Events || []).filter(function (event) {
          return event.Type === 0 && event.Comp === 1;
        }).length;
        guestScore = (data.Events || []).filter(function (event) {
          return event.Type === 0 && event.Comp === 2;
        }).length;
        if (date < today && !finished) {
          return next();
        }
        if (!guest || !host) {
          console.log(!guest ? data.Comps[0].Name : '', !host ? data.Comps[1].Name : '');
          return next();
        }
        return async.waterfall([function (next) {
          Team.findOneAndUpdate({
            'name' : guest
          }, {'$set' : {
            'slug'    : slug(guest),
            'name'    : guest,
            'picture' : flags[data.Comps[1].Name]
          }}, {'upsert' : true}, next);
        }, function (team, next) {
          guestId = team._id;
          next();
        }, function (next) {
          Team.findOneAndUpdate({
            'name' : host
          }, {'$set' : {
            'slug'    : slug(host),
            'name'    : host,
            'picture' : flags[data.Comps[0].Name]
          }}, {'upsert' : true}, next);
        }, function (team, next) {
          hostId = team._id;
          next();
        }, function (next) {
          Match.findOneAndUpdate({
            'guest'        : guestId,
            'host'         : hostId,
            'round'        : round,
            'championship' : championship._id
          }, {'$set' : {
            'slug'         : 'round-' + round + '-' + slug(host) + '-vs-' + slug(guest),
            'guest'        : guestId,
            'host'         : hostId,
            'round'        : round,
            'championship' : championship._id,
            'date'         : date,
            'finished'     : finished,
            'elapsed'      : elapsed,
            'result'       : {
              'guest' : guestScore,
              'host'  : hostScore
            }
          }}, {'upsert' : true}, next);
        }, function (match, next) {
          Championship.findOneAndUpdate({
            'slug' : slug(championship.name) + '-' + slug(championship.country) + '-' + championship.edition,
            '$or'  : [
              {'currentRound' : {'$lt' : round}},
              {'currentRound' : null}
            ]
          }, {'$set' : {
            'currentRound' : round
          }}, next);
        }], next);
      }, next);
    }], next);
  }, next);
};

if (require.main === module) {
  mongoose.connect(nconf.get('MONGOHQ_URL'));
  async.whilst(function () {
    return Date.now() - now.getTime() < 1000 * 60 * 10;
  }, function (next) {
    module.exports(function (error) {
      if (error) {
        console.error(error);
      }
      setTimeout(next, 30000);
    });
  }, process.exit);
}