const Discord = require( 'discord.js' );
const bot = new Discord.Client();
const util = require( 'util' )
const config = require( './config.json' )
var readyspam = 0;
var firstrun = 1;
var emode = false;
var token = config.token;
bot.on( 'ready', () => {
	console.log( 'Everything connected!' );
	if ( readyspam == 0 ) {
		readyspam = 1;
		setTimeout( function() {
			readyspam = 0;
		}, 3000 );
	} else {
		console.error( "Stopping due to client-ready spam, please restart the bot!" );
		process.exit( 1 );
	}
} );
bot.on( 'message', msg => {
	if ( msg.author.id !== bot.user.id ) return;
	if ( msg.content.startsWith( prefix + 'eval' ) ) { // TODO: better command handling
		var code = msg.content.substr( 7 );
		try {
			let evaled = eval( code );
			if ( evaled === token || evaled == "token" || evaled.toString().indexOf( token ) != -1 || evaled.toString().indexOf( "token" ) != -1 ) {
				evaled = 'Don\'t eval your token, that is... Hmm, bad.';
				msg.delete();
			}
			pro = msg.channel.send( "\`\`\`\n" + evaled + "\n\`\`\`" );
			// TODO: .catch handle message with over 2k chars
			if ( evaled !== null && typeof evaled === 'object' ) {
				//TODO: check if evaled has custom toString, if it does let it live
				pro.then( m => m.delete( 60000 ) )
			}
		} catch ( err ) {
			if ( err !== null && typeof err === 'object' ) {
				err = util.inspect( err )
