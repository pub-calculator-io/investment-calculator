function calculate(){
	const calcType = input.get('loan_type').index().val();

	const pv = input.get('starting_amount').gt(0).val();
	const years = input.get('after').gt(0).val();
	const rate = input.get('return_rate').gt(0).val();
	const compound = input.get('compound').index().val();
	const contribution = +input.get('additional_contribution').val();
	const contributionFrequency = input.get('each').raw();
	const contributionTime = input.get('contribute').raw();

	const fv2 = input.get('your_target').gt(0).val();
	const pv2 = input.get('starting_amount_2').gt(0).val();
	const years2 = input.get('after_2').gt(0).val();
	const rate2 = input.get('return_rate_2').gt(0).val();
	const compound2 = input.get('compound_2').index().val();

	const fv3 = input.get('your_target_2').gt(0).lte(100000000).val();
	const pv3 = input.get('starting_amount_3').gt(0).lt('your_target_2').val();
	const years3 = input.get('after_3').gt(0).val();
	const compound3 = input.get('compound_3').index().val();
	const contribution3 = +input.get('additional_contribution_2').val();

	const fv4 = input.get('your_target_3').gt(0).val();
	const years4 = input.get('after_4').gt(0).val();
	const rate4 = input.get('return_rate_3').gt(0).val();
	const compound4 = input.get('compound_3').index().val();
	const contribution4 = +input.get('additional_contribution_3').lt('your_target_3').val();

	const fv5 = input.get('your_target_4').gt(0).val();
	const pv5 = +input.get('starting_amount_4').lt('your_target_4').val();
	const rate5 = input.get('return_rate_4').gt(0).val();
	const compound5 = input.get('compound_4').index().val();
	const contribution5 = +input.get('additional_contribution_4').lt('your_target_4').val();

	if(!input.valid()) return;

	const contributionF = contributionFrequency === 'month' ? 12 : 1;
	const inEnd = contributionTime === 'end';
	if(calcType === 0){
		const result = calculateAmortization(pv, years, rate, getCompound(compound), contribution, contributionFrequency, contributionTime);
		const FV = result[result.length - 1].endBalance;
		const totalInterest = result[result.length - 1].totalInterest;
		const totalPrincipal = result[result.length - 1].totalContribution + pv;
		output.val('End Balance: $107,245.61').replace('$107,245.61', currencyFormat(FV)).set('resultA-1');
		output.val('Total Principal: $56,000.00').replace('$56,000.00', currencyFormat(totalPrincipal)).set('resultA-2');
		output.val('Total Interest: $51,245.61').replace('$51,245.61', currencyFormat(totalInterest)).set('resultA-3');
		showResult(result, pv);
	}
	else if(calcType === 1){
		const contribution2 = get_contribution(getCompound(compound2), contributionF, fv2, pv2, rate2 / 100, years2, inEnd);
		const result2 = calculateAmortization(pv2, years2, rate2, getCompound(compound2), contribution2, contributionFrequency, contributionTime);
		const totalInterest = result2[result2.length - 1].totalInterest;
		const totalPrincipal = result2[result2.length - 1].totalContribution + pv;
		output.val('You will need to contribute $200.00 at the end of each year to reach the target of $107,245.61.').replace('year', contributionFrequency).replace('$200.00', currencyFormat(contribution2)).replace('$107,245.61', currencyFormat(fv2)).set('resultB');
		output.val('End Balance: $107,245.61').replace('$107,245.61', currencyFormat(fv2)).set('resultB-1');
		output.val('Total Principal: $56,000.00').replace('$56,000.00', currencyFormat(totalPrincipal)).set('resultB-2');
		output.val('Total Interest: $51,245.61').replace('$51,245.61', currencyFormat(totalInterest)).set('resultB-3');
		showResult(result2, pv2);
	}
	else if(calcType === 2){
		let totalContribution = contribution3 * years3 * contributionF;
		let totalInvested = pv3 + totalContribution;
		var r = 0;
		if(totalInvested > fv3) {
			return input.error(['starting_amount_3', 'additional_contribution_2'], 'Total invested cannot be greater than future value', true);
		}
		else {
			var roi = fv3 / totalInvested * 100;
			var increment = 10;
			var i = 0;
			while (!r && i < 100000) {
				let futureValue = calculateFV(pv3, years3, roi, getCompound(compound3), contribution3, contributionFrequency, contributionTime);
				if((futureValue / fv3) < 0.999) {
					roi += increment;
					increment = roundTo(increment * 0.3, 4);
				}
				else if((futureValue / fv3) >= 0.999 && (futureValue / fv3) <= 1.005) {
					r = roundTo(roi, 2);
				}
				else {
					roi -= increment;
				}
				i++;
			}
		}
		const result3 = calculateAmortization(pv3, years3, r, getCompound(compound3), contribution3, contributionFrequency, contributionTime);
		const totalInterest = result3[result3.length - 1].totalInterest;
		const totalPrincipal = result3[result3.length - 1].totalContribution + pv3;
		output.val('You will need an annual return rate of 6% to reach the target of $107,245.61.').replace('year', contributionFrequency).replace('6%', r + '%').replace('$107,245.61', currencyFormat(fv3)).set('resultC');
		output.val('End Balance: $107,245.61').replace('$107,245.61', currencyFormat(fv3)).set('resultC-1');
		output.val('Total Principal: $56,000.00').replace('$56,000.00', currencyFormat(totalPrincipal)).set('resultC-2');
		output.val('Total Interest: $51,245.61').replace('$51,245.61', currencyFormat(totalInterest)).set('resultC-3');
	}
	else if(calcType === 3){
		const pv4 = get_primalvalue_with_contrib(fv4, years4, rate4 / 100, getCompound(compound4), contribution4, contributionF, inEnd);
		const result4 = calculateAmortization(pv4, years4, rate4, getCompound(compound4), contribution4, contributionFrequency, contributionTime);
		const totalInterest = result4[result4.length - 1].totalInterest;
		const totalPrincipal = result4[result4.length - 1].totalContribution + pv4;
		output.val('You will need to invest $20,000.00 at the beginning to reach the target of $107,245.61.').replace('$20,000.00', currencyFormat(pv4)).replace('$107,245.61', currencyFormat(fv4)).set('resultD');
		output.val('End Balance: $107,245.61').replace('$107,245.61', currencyFormat(fv4)).set('resultD-1');
		output.val('Total Principal: $56,000.00').replace('$56,000.00', currencyFormat(totalPrincipal)).set('resultD-2');
		output.val('Total Interest: $51,245.61').replace('$51,245.61', currencyFormat(totalInterest)).set('resultD-3');
	}
	else if(calcType === 4){
		let totalInvested = pv5 + contribution5;
		if(totalInvested > fv5){
			return input.error(['starting_amount_2', 'additional_contribution_4'], 'Total invested cannot be greater than future value', true);
		}
		else {
			var y = 0.2;
			var yResult = 0;
			var increment = 5;
			var i = 0;
			while (!yResult && i < 10000) {
				let futureValue = calculateFV(pv5, y, rate5, getCompound(compound5), contribution5, contributionFrequency, contributionTime);
				if((fv5 / futureValue) < 0.999) {
					y -= increment;
					increment = roundTo(increment * 0.3, 3);
				}
				else if((fv5 / futureValue) >= 0.999 && (fv5 / futureValue) <= 1.005) {
					yResult = roundTo(y, 1);
				}
				else {
					y += increment;
				}
				i++;
			}
			const result5 = calculateAmortization(pv5, yResult, rate5, getCompound(compound5), contribution5, contributionFrequency, contributionTime);
			const totalInterest = result5[result5.length - 1].totalInterest;
			const totalPrincipal = result5[result5.length - 1].totalContribution + pv5;
			output.val('You will need to invest 15 years to reach the target of $107,245.61.').replace('15', yResult).replace('$107,245.61', currencyFormat(fv5)).set('resultE');
			output.val('End Balance: $107,245.61').replace('$107,245.61', currencyFormat(fv4)).set('resultE-1');
			output.val('Total Principal: $56,000.00').replace('$56,000.00', currencyFormat(totalPrincipal)).set('resultE-2');
			output.val('Total Interest: $51,245.61').replace('$51,245.61', currencyFormat(totalInterest)).set('resultE-3');
		}
	}
}

function showResult(result, principal){
	let annualResults = [];
	let chartData = [[], [], [], []];
	let annualInterest = 0;
	let annualContribution = 0;
	let monthlyResultsHtml = '';
	let annualResultsHtml = '';
	result.forEach((item, index) => {
		monthlyResultsHtml += `<tr>
			<td class="text-center">${index + 1}</td>
			<td>${currencyFormat(item.startBalance)}</td>
			<td>${currencyFormat(item.interestPayment)}</td>
			<td>${currencyFormat(item.contributionAmount)}</td>
			<td>${currencyFormat(item.endBalance)}</td>
		</tr>`;
		annualInterest += item.interestPayment;
		annualContribution += item.contributionAmount;
		if((index + 1) % 12 === 0 || (index + 1) === result.length){
			let title = 'Year #{1} End'.replace('{1}', Math.ceil((index + 1) / 12).toString());
			monthlyResultsHtml += `<th class="indigo text-center" colspan="5">${title}</th>`;
		}
		if((index + 1) % 12 === 0 || (index + 1) === result.length){
			annualResults.push({
				"interestPayment": annualInterest,
				"contribution": annualContribution,
				"endBalance": item.endBalance,
				"startBalance": item.startBalance,
				"totalInterest": item.totalInterest,
				"totalContributions": item.totalContribution,
			});
			annualInterest = 0;
			annualContribution = 0;
		}
	});
	const years = Math.ceil(result.length / 12);
	let chartLegendHtml = '';
	for(let i = 0; i <= years / 5; i++){
		chartLegendHtml += `<p class="result-text result-text--small">${i * 5} yr</p>`;
	}
	if(years % 5 !== 0){
		chartLegendHtml += `<p class="result-text result-text--small">${years} yr</p>`;
	}
	annualResults.forEach((r, index) => {
		annualResultsHtml += `<tr>
			<td class="text-center">${index + 1}</td>
			<td>${currencyFormat(r.startBalance)}</td>
			<td>${currencyFormat(r.interestPayment)}</td>
			<td>${currencyFormat(r.contribution)}</td>
			<td>${currencyFormat(r.endBalance)}</td>
	</tr>`;
		chartData[0].push((index + 1));
		chartData[1].push(roundTo(r.endBalance, 0));
		chartData[2].push(roundTo(r.totalInterest, 0));
		chartData[3].push(roundTo(r.totalContributions, 0));
	});
	const fv = result[result.length - 1].endBalance;
	const totalInterest = result[result.length - 1].totalInterest;
	const totalContributions = result.reduce((acc, item) => acc + item.contributionAmount, 0);
	const interestPercent = totalInterest / fv * 100;
	const contributionPercent = totalContributions / fv * 100;
	const principalPercent = principal / fv * 100;

	changeChartData([roundTo(interestPercent, 0), roundTo(principalPercent, 0), roundTo(contributionPercent, 0)], chartData);
	_('chart__legend').innerHTML = chartLegendHtml;
	output.val(annualResultsHtml).set('annual-results');
	output.val(monthlyResultsHtml).set('monthly-results');
}

function getCompound(compound){
	switch(compound){
		case 0:
			return 12;
		case 1:
			return 2;
		case 2:
			return 4;
		case 3:
			return 24;
		case 4:
			return 26;
		case 5:
			return 52;
		case 6:
			return 365;
	}
}

function calculateAmortization(pv, years, rate, compound = 12, contribution = 0, contributionFrequency = 'month', contributionTime = 'end'){
	let amortization = [];
	const months = years * 12;
	const cc = compound / 12
	const interest = rate / 100 / compound;
	var balance = pv;
	let ratePayB = Math.pow(1 + interest, cc) - 1;
	var totalContribution = 0;
	var totalInterest = 0;
	for (let i = 1; i <= months; i++) {
		let contributionAmount = 0;
		if(contribution && contributionTime === 'beginning'){
			if(contributionFrequency === 'month' || (i - 1) % 12 === 0){
				balance += contribution;
				contributionAmount += contribution;
				totalContribution += contribution;
			}
		}
		let startBalance = balance;
		let interestPayment = balance * ratePayB;
		totalInterest += interestPayment;
		balance += interestPayment;
		if(contribution && contributionTime === 'end'){
			if(contributionFrequency === 'month' || i % 12 === 0){
				balance += contribution;
				contributionAmount += contribution;
				totalContribution += contribution;

			}
		}

		amortization.push({
			startBalance,
			endBalance: balance,
			interestPayment,
			totalContribution,
			totalInterest,
			contributionAmount
		})
	}
	return amortization;
}

function get_annuitetrate(compound_periods_per_year, pay_back_per_year, interest_rate_year) {
	const cp = compound_periods_per_year == pay_back_per_year ? 1 : compound_periods_per_year / pay_back_per_year;
	const ic = compound_periods_per_year == 1 ? interest_rate_year : interest_rate_year / compound_periods_per_year;
	return Math.pow(1 + ic, cp) - 1;
}

function get_primalvalue_with_contrib(future_value, years, rateP_year, compound_per_year, contribution, contribution_per_year, at_the_end = true){
	const rate_an = get_annuitetrate(compound_per_year, contribution_per_year, rateP_year);

	const when_contrib = at_the_end ? 1 : (1 + rate_an);
	return (future_value - ((contribution * (Math.pow(1 + rate_an, years * contribution_per_year) - 1)) * when_contrib / rate_an))  / Math.pow(1 + rate_an, years * contribution_per_year)
}

function get_contribution(compound_periods_per_year, contribution_per_year, needed_amount, existing_savings, interest_rate_year, years, at_the_end = true) {
	const rateP = get_annuitetrate(compound_periods_per_year, contribution_per_year, interest_rate_year);
	const when_contrib = at_the_end ? 1 : (1 + rateP);
	return (needed_amount - existing_savings * Math.pow(1 + rateP, years * contribution_per_year)) / (
		(Math.pow(1 + rateP, years * contribution_per_year) - 1) * when_contrib / rateP)
}

function currencyFormat(num) {
	return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function calculateFV(pv, years, rate, compound = 12, contribution = 0, contributionFrequency = 'month', contributionTime = 'end'){
	const amortization = calculateAmortization(pv, years, rate, compound, contribution, contributionFrequency, contributionTime);
	if(contribution){
		return amortization[amortization.length - 1].endBalance;
	}
	return false;
}
