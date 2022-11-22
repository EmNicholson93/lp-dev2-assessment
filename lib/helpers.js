const readline = require('readline')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: 'LP Bank> ',
})

rl.on('close', () => {
	process.exit(1)
})


function render(lines) {
	clear_screen_and_scrollback()
	process.stdout.write(lines.join("\n") + "\n")

	rl.prompt()
}


function handle_input(handler) {
	rl.on('line', line => {
		handler(line.trim())
	})
}


function clear_screen_and_scrollback() {
	process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
	process.stdout.cursorTo(0,0)
	process.stdout.clearScreenDown()
}


function red(string) {
	return "\033[31;1m" + string + "\033[0m"
}

function green(string) {
	return "\033[32;1m" + string + "\033[0m"
}

function yellow(string) {
	return "\033[33;1m" + string + "\033[0m"
}

function blue(string) {
	return "\033[34;1m" + string + "\033[0m"
}




const TERM = '\u00A0'
function handle_message(conn, handler) {
	let buffer = ''

	function flush() {
		handler(buffer)
		buffer = ''
	}

	conn.on('data', chunk => {
		chunk = chunk.toString()

		if (chunk.charAt(chunk.length - 1) === TERM) {
			buffer += chunk.slice(0, chunk.length - 1)
			flush()
		}
		else {
			buffer += chunk
		}
	})
}

function send_message(conn, message) {
	conn.write(message + TERM)
}

function open_or_closed(connCustomers) {
	connCustomers.map((conn, i) => {
		if (i === 0) {
			send_message(conn, `The Bank is ${green("open")}.\nYou are the next customer to be served.\n`);
	
		} else if (i >= 1) {
	
			send_message(conn, `The Bank is ${green("open")}.\nThere is ${i} customer in line ahead of you.\n`);
	
		} else {
	
			send_message(conn, `The Bank is ${red("closed")}.`);
		}
	}) 
}

function next_customer(connCustomers, beingServed) {
	connCustomers.map((conn, i) => {
		if(i === 0) {
			beingServed.push(conn)

			send_message(conn, `The Bank is ${green("open")}.\nTeller #1 is now serving you!\n\n[ TELLER ] What can I help you with?\n`
			)
		} else if (i === 1) {
			send_message(conn, `The Bank is ${green("open")}.\nYou are the next customer to be served.\n`)
		} else {
			send_message(conn, `The Bank is ${green("open")}.\nThere is ${i - 1} customer in line ahead of you.\n`);
		}

	})
}


module.exports = {
	render,
	handle_input,

	handle_message,
	send_message,

	red,
	green,
	yellow,
	blue,

	open_or_closed,
	next_customer
}