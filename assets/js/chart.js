// CHART_DONUT_BIG CHART_LOAN
'use strict'
let switchTheme = null;

import("./assets/js/lib/chartjs/chart.js").then((e) => {
	let Chart = e.Chart
	let registerables = e.registerables
	Chart.register(...registerables)

	const theme = localStorage.getItem('theme') !== 'system' ? localStorage.getItem('theme') : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	const colors = {
		light: {
			purple: '#A78BFA',
			yellow: '#FBBF24',
			sky: '#7DD3FC',
			blue: '#1D4ED8',
			red: '#F87171',
			textColor: '#6B7280',
			yellowGradientStart: 'rgba(250, 219, 139, 0.33)',
			purpleGradientStart: 'rgba(104, 56, 248, 0.16)',
			skyGradientStart: 'rgba(56, 187, 248, 0.16)',
			tealGradientStart: 'rgba(56, 248, 222, 0.16)',
			yellowGradientStop: 'rgba(250, 219, 139, 0)',
			purpleGradientStop: 'rgba(104, 56, 248, 0)',
			skyGradientStop: 'rgba(56, 248, 222, 0.16)',
			gridColor: '#DBEAFE',
			tooltipBackground: '#fff',
			fractionColor: '#EDE9FE',
		},
		dark: {
			purple: '#7C3AED',
			yellow: '#D97706',
			sky: '#0284C7',
			blue: '#101E47',
			red: '#F87171',
			textColor: '#fff',
			yellowGradientStart: 'rgba(146, 123, 67, 0.23)',
			purpleGradientStart: 'rgba(78, 55, 144, 0.11)',
			skyGradientStart: 'rgba(56, 187, 248, 0.16)',
			tealGradientStart: 'rgba(56, 248, 222, 0.16)',
			yellowGradientStop: 'rgba(250, 219, 139, 0)',
			purpleGradientStop: 'rgba(104, 56, 248, 0)',
			skyGradientStop: 'rgba(56, 248, 222, 0.16)',
			gridColor: '#162B64',
			tooltipBackground: '#1C3782',
			fractionColor: '#41467D',
		},
	};

	let data = [
		{
			data: [48, 19, 34],
			labels: ['48%', '19%', '34%'],
			backgroundColor: [colors[theme].yellow, colors[theme].purple, colors[theme].sky],
			borderColor: '#DDD6FE',
			borderWidth: 0,
		},
	];

	let options = {
		rotation: 0,
		cutout: '37%',
		hover: {mode: null},
		responsive: false,
		layout: {
			padding: 30,
		},
		plugins: {
			tooltip: {
				enabled: false,
			},
			legend: {
				display: false,
			},
		},
	};

	const customDataLabels = {
		id: 'customDataLabel',
		afterDatasetDraw(chart, args, pluginOptions) {
			const {
				ctx,
				data
			} = chart;
			ctx.save();

			data.datasets[0].data.forEach((datapoint, index) => {
				const { x, y } = chart.getDatasetMeta(0).data[index].tooltipPosition();

				ctx.textAlign = 'center';
				ctx.font = '14px Inter';
				ctx.fillStyle = '#fff';
				ctx.textBaseline = 'middle';
				let toolTipText = datapoint != '0' ? datapoint + '%' : '';
				ctx.fillText(toolTipText, x, y);
			});
		},
	};

	let donutBig = new Chart(document.getElementById('chartDonutBig'), {
		type: 'doughnut',
		data: {
			datasets: data,
		},
		options: options,
		plugins: [customDataLabels],
	});

	let switchThemeDonut = function(theme) {
		donutBig.destroy()

		const customDataLabels = {
			id: 'customDataLabel',
			afterDatasetDraw(chart, args, pluginOptions) {
				const {
					ctx,
					data,
					chartArea: { top, bottom, left, right, width, height },
				} = chart;
				ctx.save();

				data.datasets[0].data.forEach((datapoint, index) => {
					const { x, y } = chart.getDatasetMeta(0).data[index].tooltipPosition();

					ctx.textAlign = 'center';
					ctx.font = '14px Inter';
					ctx.fillStyle = '#fff';
					ctx.textBaseline = 'middle';
					let toolTipText = datapoint != '0' ? datapoint + '%' : '';
					ctx.fillText(toolTipText, x, y);
				});
			},
		};

		donutBig = new Chart(document.getElementById('chartDonutBig'), {
			type: 'doughnut',
			data: {
				datasets: data,
			},
			options: options,
			plugins: [customDataLabels],
		});

		donutBig.data.datasets[0].backgroundColor = [colors[theme].purple, colors[theme].sky, colors[theme].yellow];
		donutBig.update()
	}

	// LOAN CHART

	let ctx = document.getElementById('chartLoan').getContext('2d');

	let yellowGradient = ctx.createLinearGradient(0, 0, 0, 1024);
	yellowGradient.addColorStop(0, colors[theme].yellowGradientStart);
	yellowGradient.addColorStop(1, colors[theme].yellowGradientStop);

	let purpleGradient = ctx.createLinearGradient(0, 0, 0, 1024);
	purpleGradient.addColorStop(0, colors[theme].purpleGradientStart);
	purpleGradient.addColorStop(1, colors[theme].purpleGradientStop);


	let skyGradient = ctx.createLinearGradient(0, 0, 0, 1024);
	skyGradient.addColorStop(0, colors[theme].skyGradientStart);
	skyGradient.addColorStop(1, colors[theme].skyGradientStop);

	let tooltip = {
		enabled: false,
		external: function (context) {
			let tooltipEl = document.getElementById('chartjs-tooltip');

			// Create element on first render
			if (!tooltipEl) {
				tooltipEl = document.createElement('div');
				tooltipEl.id = 'chartjs-tooltip';
				tooltipEl.innerHTML = '<table></table>';
				document.body.appendChild(tooltipEl);
			}

			// Hide if no tooltip
			const tooltipModel = context.tooltip;
			if (tooltipModel.opacity === 0) {
				tooltipEl.style.opacity = 0;
				return;
			}

			// Set caret Position
			tooltipEl.classList.remove('above', 'below', 'no-transform');
			if (tooltipModel.yAlign) {
				tooltipEl.classList.add(tooltipModel.yAlign);
			} else {
				tooltipEl.classList.add('no-transform');
			}

			function getBody(bodyItem) {
				return bodyItem.lines;
			}

			if (tooltipModel.body) {
				const bodyLines = tooltipModel.body.map(getBody);

				let innerHtml = '<thead>';

				let year = +(Number(tooltipModel.title) * 12).toFixed(0);
				let months = +(year % 12).toFixed(0);
				let yearText = `Year ${(year - months) / 12}`;
				let monthText = months === 0 ? '' : `, Month ${months}`;
				innerHtml += '<tr><th class="loan-chart__title">' + yearText + monthText + '</th></tr>';

				innerHtml += '</thead><tbody>';
				bodyLines.forEach(function (body, i) {
					innerHtml += '<tr><td class="loan-chart__text">' + body + '</td></tr>';
				});
				innerHtml += '</tbody>';

				let tableRoot = tooltipEl.querySelector('table');
				tableRoot.innerHTML = innerHtml;
			}

			const position = context.chart.canvas.getBoundingClientRect();

			// Display, position, and set styles for font
			tooltipEl.style.opacity = 1;
			tooltipEl.style.position = 'absolute';
			tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - tooltipEl.clientWidth / 2 + 'px';
			tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - tooltipEl.clientHeight / 2 + 'px';
			// tooltipEl.style.font = bodyFont.string;
			tooltipEl.classList.add('loan-chart');
		},
	};

	const dataCharts = {
		labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
		datasets: [
			{
				data: [
					23701,
					27630,
					31801,
					36229,
					40931,
					45923,
					51222,
					56849,
					62822,
					69164,
					75897,
					83045,
					90634,
					98691,
					107246
				],
				type: 'line',
				order: 1,
				label: 'Balance',
				pointHoverBackgroundColor: '#FFFFFF',
				pointHoverBorderWidth: 2,
				pointHoverRadius: 6,
				pointHoverBorderColor: '#5045E5',
				borderColor: colors[theme].purple,
				backgroundColor: purpleGradient,
				fill: true,
			},
			{
				label: 'Interest',
				data: [
					1301,
					2830,
					4601,
					6629,
					8931,
					11523,
					14422,
					17649,
					21222,
					25164,
					29497,
					34245,
					39434,
					45091,
					51246
				],
				type: 'line',
				order: 1,
				pointHoverBackgroundColor: '#FFFFFF',
				pointHoverBorderWidth: 2,
				pointHoverRadius: 6,
				pointHoverBorderColor: '#5045E5',
				borderColor: colors[theme].yellow,
				backgroundColor: yellowGradient,
				fill: true,
			},
			{
				label: 'Contributions',
				data: [
					2400,
					4800,
					7200,
					9600,
					12000,
					14400,
					16800,
					19200,
					21600,
					24000,
					26400,
					28800,
					31200,
					33600,
					36000,
				],
				type: 'line',
				order: 3,
				pointHoverBackgroundColor: '#FFFFFF',
				pointHoverBorderWidth: 2,
				pointHoverRadius: 6,
				pointHoverBorderColor: '#5045E5',
				borderColor: colors[theme].sky,
				backgroundColor: skyGradient,
				fill: true,
			},
		],
	};

	let chartLoan = new Chart(document.getElementById('chartLoan'), {
		data: dataCharts,
		options: {
			stepSize: 1,
			response: true,
			elements: {
				point: {
					radius: 0,
				},
			},
			plugins: {
				legend: {
					display: false,
				},
				tooltip: tooltip,
			},
			interaction: {
				mode: 'index',
				intersect: false,
			},
			scales: {
				y: {
					grid: {
						tickLength: 0,
						color: colors[theme].gridColor,
					},
					ticks: {
						display: false,
						stepSize: 1,
					},
					border: {
						color: colors[theme].gridColor,
					},
				},
				x: {
					border: {
						color: colors[theme].gridColor,
					},
					ticks: {
						display: false,
						color: colors[theme].gridColor,
						stepSize: 1,
					},
					grid: {
						tickLength: 0,
						color: colors[theme].gridColor,
					},
				},
			},
		},
	});

	let switchThemeLoan = function(theme) {
		yellowGradient.addColorStop(0, colors[theme].yellowGradientStart);
		yellowGradient.addColorStop(1, colors[theme].yellowGradientStop);
		purpleGradient.addColorStop(0, colors[theme].purpleGradientStart);
		purpleGradient.addColorStop(1, colors[theme].purpleGradientStop);
		chartLoan.data.datasets[1].backgroundColor = yellowGradient;
		chartLoan.data.datasets[1].borderColor = colors[theme].yellow;
		chartLoan.data.datasets[0].backgroundColor = purpleGradient;
		chartLoan.data.datasets[0].borderColor = colors[theme].purple;
		chartLoan.data.datasets[2].borderColor = colors[theme].sky;
		chartLoan.data.datasets[2].backgroundColor = skyGradient;
		chartLoan.options.scales.y.grid.color = colors[theme].gridColor;
		chartLoan.options.scales.x.grid.color = colors[theme].gridColor;
		chartLoan.options.scales.y.ticks.color = colors[theme].gridColor;
		chartLoan.options.scales.x.ticks.color = colors[theme].gridColor;
		chartLoan.options.scales.y.border.color = colors[theme].gridColor;
		chartLoan.options.scales.x.border.color = colors[theme].gridColor;
		chartLoan.update()
	}

	window.changeChartData = function(values, values_two) {
		donutBig.data.datasets[0].data = values
		donutBig.data.datasets[0].labels = values.map(value => `${value}%`)
		donutBig.update()

		chartLoan.data.labels = values_two[0]
		chartLoan.data.datasets[0].data = values_two[1]
		chartLoan.data.datasets[1].data = values_two[2]
		chartLoan.data.datasets[2].data = values_two[3]
		chartLoan.update()
	}


	switchTheme = [switchThemeLoan, switchThemeDonut]

})
