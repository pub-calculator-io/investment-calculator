<?php
/*
Plugin Name: CI Investment calculator
Plugin URI: https://www.calculator.io/investment-calculator/
Description: This free investment calculator considers the initial and ending balances, return rate, and investment time when evaluating various investment circumstances.
Version: 1.0.0
Author: Investment Calculator / www.calculator.io
Author URI: https://www.calculator.io/
License: GPLv2 or later
Text Domain: ci_investment_calculator
*/

if (!defined('ABSPATH')) exit;

if (!function_exists('add_shortcode')) return "No direct call for Investment Calculator by www.calculator.io";

function display_calcio_ci_investment_calculator(){
    $page = 'index.html';
    return '<h2><img src="' . esc_url(plugins_url('assets/images/icon-48.png', __FILE__ )) . '" width="48" height="48">Investment Calculator</h2><div><iframe style="background:transparent; overflow: scroll" src="' . esc_url(plugins_url($page, __FILE__ )) . '" width="100%" frameBorder="0" allowtransparency="true" onload="this.style.height = this.contentWindow.document.documentElement.scrollHeight + \'px\';" id="ci_investment_calculator_iframe"></iframe></div>';
}


add_shortcode( 'ci_investment_calculator', 'display_calcio_ci_investment_calculator' );