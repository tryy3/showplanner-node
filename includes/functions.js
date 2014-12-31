var exports = module.exports = {}

exports.log = {
	level: 0,
	prefix : {
		main: "Showplanner-log ",
		log : "LOG: ",
		info : "INFO: ",
		warning: "WARNING: ",
		debug: "DEBUG: "
	},
	init : function(config)
	{
		this.level = config.log;
	},
	log : function(msg, bol)
	{
		if (this.level >= 0)
		{
			if (bol)
			{
				console.log(msg);
				return;
			}
			console.log(this.prefix.main + this.prefix.log + msg)
		}
	},
	info : function(msg, bol)
	{
		if (this.level > 0)
		{
			if (bol)
			{
				console.log(msg);
				return;
			}
			console.log(this.prefix.main + this.prefix.info + msg)
		}
	},
	warning : function(msg, bol)
	{
		if (this.level > 1)
		{
			if (bol)
			{
				console.log(msg);
				return;
			}
			console.log(this.prefix.main + this.prefix.warning + msg)
		}
	},
	debug : function(msg, bol)
	{
		if (this.level > 2)
		{
			if (bol)
			{
				console.log(msg);
				return;
			}
			console.log(this.prefix.main + this.prefix.debug + msg)
		}
	}
}