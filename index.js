//Single index queries
import pfSenseBlockedRoute from './server/routes/pfsenseblocked';
import firewallLoginAttempts from './server/routes/firewallloginattempts';
import honeyTrapNonHeartBeat from './server/routes/honeytrapnonheartbeat';
import snortMessages from './server/routes/snortmessages';
import windowsDefenderMalware from './server/routes/windowsdefendermalware';
//Add multi (cross)-index queries
import honeySnort from './server/routes/honeysnort';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'fsm_plugin',
    uiExports: {
      app: {
        title: 'Fsm Plugin',
        description: 'Federated Security Module Plugin',
        main: 'plugins/fsm_plugin/app',
      },
      hacks: [
        'plugins/fsm_plugin/hack',
      ],
      styleSheetPaths: require('path').resolve(__dirname, 'public/app.scss'),
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init(server, options) { // eslint-disable-line no-unused-vars
      // Add server routes and initialize the plugin here
		pfSenseBlockedRoute(server);
		firewallLoginAttempts(server);
		honeyTrapNonHeartBeat(server);
		snortMessages(server);
		windowsDefenderMalware(server);
		honeySnort(server);
    }
  });
}
