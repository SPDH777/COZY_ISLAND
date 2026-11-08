/* ===== B38: diálogos con la perspectiva correcta, sin repetidos y más textos ===== */
(function(){try{
const DD=(typeof D!=='undefined'&&D)||(window.__BL&&window.__BL.D);if(!DD){console.error('[B38] sin D');return}
const nd=(q,...o)=>({q,o});
/* líneas nuevas: [monólogos], [nodos: el habitante habla y tú reaccionas] */
const AM={
Sora:['Hoy conté siete nubes con forma de barco.','A veces dejo una flor en el agua y la veo irse despacito.','El lago me escucha sin interrumpir; es buen amigo.'],
Mateo:['Llevo tres anzuelos enredados hoy. La paciencia también se entrena.','Si escuchas el agua, sabes cuándo van a picar.','El termo de café es la mitad de mi equipo de pesca.','Hoy el lago amaneció como un espejo; los peces andan tímidos.'],
Mika:['Hoy conté diez mariposas, pero una se escapó, así que fueron nueve.','Me dicen que no corra, pero las piernas me salen solas.','Si encuentras una pluma, guárdala: dan suerte.','Quiero aprender a silbar como los pájaros.'],
Kenji:['Mezclé azul con un poco de naranja y salió el color del atardecer… más o menos.','Mi pincel favorito tiene tres pelos. Los mejores.','La luz de la mañana engaña: pinta rápido o desaparece.','Nunca termino un cuadro; solo lo dejo descansar.'],
Hana:['Las hojas grandes protegen a las pequeñas; un jardín también es una familia.','Esta semana trasplanté lavanda junto a la cabaña.','Si una planta se pone triste, casi siempre le falta sol o paciencia.','Me encanta el sonido de la regadera por la mañana.'],
Taro:['La masa madre amaneció de buen humor: el pan va a salir esponjoso.','Un pan sale mejor cuando alguien lo espera con hambre.','Hoy probé canela con manzana. Si te gusta, avísame.','Mi horno hace un ruidito cuando el pan está listo; ya lo conozco de memoria.'],
Luna:['Hay una estrella que casi no se ve: solo aparece si no la miras de frente.','Anoto cada estrella fugaz en mi libreta. Llevo ochenta y dos.','Esta noche la luna sale tarde y bien redonda.','El cielo de esta isla es un regalo.'],
Bruno:['Mi barco está en reparación… bueno, mi balde está en reparación.','Navegué tantos mares que ahora me mareo en la hamaca.','Dicen que la brisa del sur trae buena pesca; yo digo que trae sueño.','Un buen capitán siempre sabe dónde está la sopa.'],
Yuki:['Hoy llevo una carta rosada que huele a lavanda.','Conozco el camino a cada casa con los ojos cerrados.','Si llueve, guardo las cartas dentro de mi gorra. Nunca falla.'],
Ren:['¡Encontré una huella de zorrito! ¿O de perrito? ¡Misterio!','Voy a dibujar un mapa de la isla; ya terminé la parte del lago.','Me dijeron que vuelva antes del atardecer. Casi siempre vuelvo.'],
Aiko:['Con tres flores y un listón se arma un ramo precioso.','Hoy descubrí que las margaritas se cierran cuando va a llover.','Las abejas ya me conocen: me dejan pasar.'],
Haru:['A mi guitarra se le desafina una cuerda con el viento. Se la dejo, le da carácter.','Hoy silbé una melodía y un pájaro me contestó.','La mejor sala de conciertos es esta isla.'],
Nori:['Mis rodillas predicen la lluvia mejor que cualquier nube.','Cada cuento que cuento cambia un poquito; así se mantienen vivos.','Si pasas por mi casa, te preparo un té de manzanilla.'],
Joel:['Hoy revisé los senderos: todo en orden, salvo una rama traviesa.','Reconozco cada árbol por su corteza, como a los amigos por la voz.','En otoño las hojas hacen alfombra; en primavera, flores.'],
Axel:['Mi mochila pesa menos desde que me comí las provisiones.','Marqué esta isla en mi mapa con una estrella grande.','Las mejores rutas aparecen cuando te pierdes un poquito.','Encontré una moneda antigua. Creo que es de chocolate.','Hoy desayuné frente a la cascada. Gran decisión.'],
Zafira:['Mi lupa y yo hemos visto cosas increíbles. Sobre todo hormigas.','Una cazatesoros nunca revela dónde escondió el suyo.','Seguí unas huellas hasta un arbusto… y era un conejito durmiendo.','Voy a dibujar el árbol rosado en mi mapa: es mi punto de referencia.','Llevo cuerda desde que caí en un charco profundo.'],
Grumbo:['La sal se pone al final; la paciencia, desde el principio.','Mi cuchara de madera es más antigua que yo.','Hoy la sopa lleva zanahoria, hongos y una pizca de buen humor.','Si algo huele rico, es que estoy cerca.','Los ogros también tenemos hora de siesta.'],
Tula:['Hoy trasplanté un girasol y lloró un poquito. Yo también.','Regar despacito importa más que regar mucho.','Las mariposas se paran en mi nariz y me encanta.','Mi jardín es gigante porque yo lo soy; si no, ¿quién lo cuidaría?','Las macetas grandes también sirven de bañera para los pájaros.'],
Pip:['¡Jiji! Te escondí una bellota en el bolsillo. Bueno… casi.','Si ves una seta, salúdala: a veces es mi casa.','Hoy me columpié en una telaraña. Fue emocionante y pegajoso.','Las gotas de rocío son mis espejitos.','¡Tengo un secreto! No, es mentira. ¡Jiji!'],
Tilo:['Las raíces conversan bajo la tierra; yo solo escucho.','Hoy medí un árbol: creció un dedo. ¡Qué orgullo!','Una piña caída es un regalo del bosque.','Las ardillas guardan nueces y olvidan dónde; así plantan árboles.','El musgo es la alfombra más suave del bosque.'],
Nuri:['Hoy practiqué encender una luz con un estornudo. Casi.','Las luciérnagas son puntualísimas; yo, no tanto.','Mi luz favorita es la que sale entre risas.','Cuando hay luna llena duermo con una lucecita pequeña.','Cada luciérnaga tiene su propio ritmo.'],
Seraf:['Miro el cielo antes de que salga el sol; es mi costumbre.','Una pluma caída no es pérdida: es dejar algo para alguien.','Me gusta escuchar la isla cuando todos duermen.','La amabilidad pesa poco y se nota mucho.']};
const CVN={
Axel:[nd('Una vez entré a una cueva donde los cristales cantaban al pasar. Casi no salgo de lo bonito que sonaba.',['Suena increíble, ¿qué cantaban?','Una nota distinta en cada paso, como un piano gigante. Salí tarareando.'],['¿No te dio miedo entrar solo?','Un poco, sí. Pero el miedo y la curiosidad viajan juntos en la mochila.']),
 nd('Estoy trazando el mapa de la isla y me falta una zona. No sé si ir por la cascada o por el bosque.',['Yo iría por la cascada','Buena idea. Si algo brilla ahí detrás, te invito a desayunar.'],['Mejor el bosque','Tiene sombra y silencio. Me gusta tu estilo.'])],
Zafira:[nd('Encontré una concha rarísima, en espiral y con colores de atardecer. ¿Quieres verla?',['Claro, enséñamela','¡Mira! Pienso dársela a Luna: ella sabrá qué es. Si no, será pisapapeles.'],['Mejor después','Trato hecho. Los tesoros se disfrutan más con calma.']),
 nd('Regla de cazatesoros: si encuentras un cofre, no lo abras sola. ¿Tú qué harías?',['Lo abriría con un amigo','Exacto. Los tesoros se abren de a dos o de a cien, nunca solos.'],['Lo abriría enseguida','¡Ja! Valiente. Pero ojo con las trampas… y con las ranas.'])],
Grumbo:[nd('Esta sopa lleva hongos, zanahoria y una hoja de laurel. Todavía no sé qué le falta. ¿Tú qué le pondrías?',['Un poco de pimienta','¡Pimienta! Un toquecito y se despierta toda la olla.'],['Más cariño','Eso no puede faltar. Ya le puse un puñado, pero le echaré otro.']),
 nd('Mucha gente se asusta al verme porque soy grande. Yo solo quiero invitarlos a la mesa.',['A mí me pareces amable','Gracias… me pones contento. Ven, que hay sopa para ti.'],['Es normal que impresione','Lo sé, no pasa nada. Con una sopa se pasa el susto.'])],
Tula:[nd('Mis girasoles miran siempre hacia donde está el sol. Yo aprendí a hacer lo mismo.',['Qué bonito, hacia lo bueno','Así es. Cuando el día se nubla, giro hacia la gente que quiero.'],['A mí me cuesta ver lo bueno','Entonces mira los girasoles un rato. Contagian optimismo.']),
 nd('Mi risa hace temblar los árboles, pero mis flores la adoran. ¿A ti te molesta?',['Para nada, es una risa linda','Qué alivio. Entonces ahí va otra: ¡jajajá! Tiemblan hasta los pájaros.'],['Un poco fuerte, sí','Tienes razón, la bajaré a la mitad. Y si no, tápate los oídos y listo.'])],
Pip:[nd('¡Pip! Escondí tu sombra en un charco. ¿La ves? ¡No! ¡Jiji!',['¡Devuélvemela!','Está bien, está bien. Pero solo si juegas conmigo a las escondidas.'],['Qué travieso eres','Es mi trabajo oficial. Tengo medalla de madera, la hice yo.']),
 nd('Quiero hacer una travesura chiquita pero bonita. ¿A quién se la hago?',['A Grumbo, con su sopa','¡Jiji! Le pondré una florecita en la cuchara. Se va a poner rojito.'],['Mejor a nadie','¡Uf, qué aburrido! Bueno… se la haré a una ardillita.'])],
Tilo:[nd('Si me ayudas a regar tres arbolitos, te cuento un secreto del bosque.',['Dime dónde regar','Un vasito de agua cada uno. Y el secreto: esta mañana nació un hongo azul.'],['Hoy no puedo','No pasa nada, el bosque espera. Aunque un arbolito se pondrá triste.']),
 nd('Dos ardillas se pelearon por una nuez. ¿Qué hago?',['Que la compartan','Eso les dije. Una la mordió por la mitad y se hicieron amigas otra vez.'],['Que busquen otra nuez','¡Qué sabio! Hay miles de nueces en el bosque.'])],
Nuri:[nd('Esta noche encenderé mil luciérnagas. ¿Quieres que te enseñe cómo?',['¡Sí, por favor!','Primero canta bajito. Luego aplaude suave. ¡Y puff! se encienden.'],['Prefiero mirar','Mejor aún: el espectáculo es más bonito con público.']),
 nd('Dicen que mi mamá era una estrella. No lo sé, pero de noche me siento cerca de ella. ¿Tú tienes algo así?',['Sí, la luna','Qué linda forma de sentirse acompañado. Mírala cuando quieras.'],['Aún no lo sé','Ya lo encontrarás. Yo tardé; ahora lo veo cada noche.'])],
Seraf:[nd('Cuido la isla desde que existe. Lo que más me gusta es ver a la gente descansar sin miedo.',['Gracias por cuidarnos','De nada. Cuidar a quien se deja cuidar es un honor.'],['¿No te cansas de vigilar?','A veces. Pero el descanso me llega al ver amanecer.']),
 nd('Cuando alguien está triste, me acerco en silencio. No sé si lo notan, pero me gusta estar.',['A veces yo me siento así','Entonces estoy aquí. No hace falta decir nada.'],['Qué bonito gesto','Gracias. A veces, estar ya es suficiente.'])]};
const EXTRA_CV={
Kenji:nd('Estoy pintando el lago esta tarde y me falta el azul más profundo. ¿Me ayudas a elegir?',['Uno oscuro, como el fondo','Perfecto. Será un lago con secretos.'],['Uno claro, como el cielo','Entonces será un lago tranquilo. Me gusta.']),
Hana:nd('Quiero plantar algo nuevo junto a mi casa. ¿Qué elegirías para empezar?',['Una rosa','Clásica y valiente: tiene espinas, pero igual da perfume.'],['Un girasol','Siempre mirando al sol. Buen ejemplo para los días nublados.']),
Taro:nd('Estoy probando una receta nueva. ¿Prefieres que sea dulce o salada?',['Dulce','Entonces habrá pastelito de fresa. Te guardo el primero.'],['Salada','Con pan crujiente al lado. Combinación de campeones.']),
Bruno:nd('Mi mapa del tesoro tiene una X, pero no recuerdo dónde la dejé. ¿Dónde crees tú?',['En la playa','Allí hay de todo: cangrejos, medusas y una bota vieja.'],['Aquí en la isla','Gran respuesta. Eso mismo pienso yo.'])};
const OGRE=[nd('Soy grande, pero ando despacito para no pisar flores.',['Qué cuidadoso','Cuesta, pero vale la pena. Una flor aplastada tarda mucho en volver.'],['Yo también ando con cuidado','Entonces nos entendemos. Los amables avanzamos lento.']),
 nd('Mis manos son enormes, pero hago cosas chiquitas con ellas: tejo, remiendo, cocino.',['¿Qué fue lo último que hiciste?','Un gorrito para un pajarito. Le quedó grande, pero lo usa de casa.'],['Qué talento','Gracias. Con paciencia, hasta un ogro hace cosas lindas.'])];
/* 1) detectar lo repetido entre habitantes */
const cnt=(get)=>{const m={};for(const k in DD)(get(DD[k])||[]).forEach(s=>{const t=typeof s==='string'?s:s&&s.q;if(t)m[t]=(m[t]||0)+1});return m};
const amC=cnt(d=>d.am),cvC=cnt(d=>d.cv);
const BAD=/^¿(Qué pintarías de mí|Qué flor me recomiendas|Cuál es tu plato favorito|Dónde está tu tesoro)/;
const oldG=DD.Grumbo&&DD.Grumbo.cv,oldT=DD.Tula&&DD.Tula.cv;
for(const k in DD){const d=DD[k];
 if(Array.isArray(d.am))d.am=d.am.filter(s=>amC[s]<3).concat(AM[k]||[]);
 if(Array.isArray(d.cv)){
  if(CVN[k])d.cv=CVN[k].slice();
  else if(d.cv===oldG||d.cv===oldT)d.cv=OGRE.slice();
  else{d.cv=d.cv.filter(n=>n&&cvC[n.q]<3&&!BAD.test(n.q));if(EXTRA_CV[k])d.cv.push(EXTRA_CV[k])}}}
/* 2) elfos: sin frases genéricas compartidas */
try{if(typeof MSG!=='undefined')MSG.length=0;
 if(typeof GREET!=='undefined')GREET.splice(0,GREET.length,'¡Hola, {c}! Qué gusto verte.','¡Buenas, {c}! Hoy está lindo el día.','¡Ey, {c}! Acércate, no seas tímido.','Hola, {c}. Qué bueno que viniste.');
 if(typeof OWN!=='undefined'){
  OWN[0].splice(0,OWN[0].length,'Soy Lirael, cuido los jardines de la isla.','Hoy las rosas abrieron antes que el sol.','Cuido cada flor como a una amiga.','Cuando cambia el viento, las hadas me avisan.','Las flores rosadas son tímidas: se abren al atardecer.','Si ves un pétalo en el aire, viene de un jardín lejano.','Mi jardín no tiene cercas: las flores saben dónde quedarse.','Esta mañana el rocío brillaba como mil perlitas.','A veces me siento entre las margaritas solo a escuchar.');
  OWN[1].splice(0,OWN[1].length,'Soy Thalion y vigilo el faro y el mar.','El faro lleva encendido más tiempo del que recuerdo.','Cada noche cuento las olas; nunca salen iguales.','La niebla huele a sal y a promesas.','Desde el faro se ve el barco más pequeño y la estrella más lejana.','El mar tiene humores, como la gente.','Si oyes campanas lejanas, es el viento jugando con las boyas.','Hoy aprendí a leer las nubes: mañana habrá brisa.','Un buen vigía sabe esperar.')}}catch(e){console.warn('[B38] elfos',e)}
window.__B38=1;
}catch(e){console.error('[B38]',e)}})();
