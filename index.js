#!/opt/homebrew/bin/node

import chalk from 'chalk';
import { program } from 'commander';
import fs from 'fs';
import inquirer from 'inquirer';

program
	.version('0.0.1')
	.description('Program for creating configuration files');

const createConfig = (name, cmd) => {
	if (
		cmd.extension &&
		!['json', 'cfg', 'txt', 'yaml'].includes(cmd.extension)
	) {
		console.log(chalk.red('\nExtension is not allowed'));
	} else {
		inquirer
			.prompt([
				{
					type: 'input',
					name: 'charset',
					message: 'Charset: ',
				},
				{
					type: 'input',
					name: 'max_ram_usage',
					message: 'Max RAM usage. MB: ',
				},
				{
					type: 'input',
					name: 'max_cpu_usage',
					message: 'Max CPU usage. %: ',
				},
				{
					type: 'input',
					name: 'check_updates_interval',
					message: 'Updates interval. MS: ',
				},
				{
					type: 'input',
					name: 'processes_count',
					message: 'Processes count: ',
				},
			])
			.then(options => {
				if (cmd.extension && cmd.extension === 'json') {
					fs.writeFileSync(
						`files/${name}.${cmd.extension}`,
						JSON.stringify(options)
					);
				} else {
					let data = '';
					for (let item in options)
						data += `${item}=${options[item]} \n`;

					fs.writeFileSync(`files/${name}.cfg`, data);
				}
				console.log(
					chalk.green(
						`\nFile "${name}.${cmd.extension || 'cfg'}" created`
					)
				);
			});
	}
};

const getAllConfigs = () => {
	const files = fs.readdirSync('files');

	let data = '';
	for (let file of files) data += `${file} \n`;

	console.log(chalk.grey(`\nConfiguration files: \n\n${data}`));
};

program
	.command('create <name>')
	.option('-e <value>, --extension <value>', 'File extension')
	.alias('c')
	.description('Create new configuration file')
	.action(createConfig);

program
	.command('all')
	.alias('a')
	.description('Show all configuration files')
	.action(getAllConfigs);

program.parse(process.argv);
