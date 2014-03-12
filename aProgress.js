/*
	Slim Android-like loading indicator
	@author Marcin Strazynski
	@date 2014
*/

;(function () {
	AProgress = {};

	AProgress.version = '0.9.9';

	var Settings = AProgress.settings = {
		parent: 'body',
		numberOfDots: 5,
		role: 'bar',
		bar: {
			selectorSign: '.',
			selectorName: 'bar',
			css: {
				height: '2px',
				width: '100%',
				position: 'fixed',
				top: '0',
				left: '0',
				background: '#3992b5'	
			}
		},
		dot: {
			selectorSign: '.',
			selectorName: 'dot',
			css: {
				height: '2px',
				width: '4px',
				position: 'absolute',
				left: '-20px',
				top: '0',
				background: '#fffff0'
			}	
		},
		animation: {
			name: 'movingDot',
			className: 'dot-animation',
			duration: '2s',
			steps: {
				'0%': '0%',
				'20%': '5%',
				'40%': '10%',
				'60%': '20%',
				'70%': '45%',
				'100%': '100%'
			}
		}
	};

	AProgress.render = function () {
		var template;
		if (AProgress.isRendered()) return;
		template = addBar();
		addDots(template, Settings.numberOfDots);
		addCssAnimation();
	};

	AProgress.config = function (config) {
		extend(Settings, config);
	};

	AProgress.isRendered = function () {
		return document.contains(document.querySelector(Settings.bar.selectorSign + Settings.bar.selectorName));
	};

	AProgress.isVisible = function () {
		var element = document.querySelector(Settings.bar.selectorSign + Settings.bar.selectorName),
			visibility; 
		if (!element) return false;
		visibility = element.style.visibility;
		return visibility === '' || visibility === 'visible';
	};

	AProgress.start = function () {
		var barTemplate, dots, i;
		AProgress.render();
		barTemplate = document.querySelector(Settings.bar.selectorSign + Settings.bar.selectorName);
		if (!AProgress.isVisible()) {
			barTemplate.style.visibility = 'visible';
		} 
		dots = barTemplate.querySelectorAll(Settings.dot.selectorSign + Settings.dot.selectorName);
		dots[0].classList.add(Settings.animation.className);
		for (i = 1; i < dots.length; i++) {
			(function (i) {
				setTimeout(function () {
					dots[i].classList.add(Settings.animation.className);
				}, i * 400);
			})(i);
		}

		barTemplate.triggerEvent('aprogress-start', {
			'callee': 'AProgress.start',
			'settings': AProgress.settings
		});
	};

	AProgress.done = function () {
		var barTemplate = document.querySelector(Settings.bar.selectorSign + Settings.bar.selectorName),
		dots, i;
		if (AProgress.isVisible()) {
			barTemplate.style.visibility = 'hidden';
		}

		dots = barTemplate.querySelectorAll(Settings.dot.selectorSign + Settings.dot.selectorName);
		for (i = 0; i < dots.length; i++) {
			dots[i].classList.remove(Settings.animation.className);
		}

		barTemplate.triggerEvent('aprogress-done', {
			'callee': 'AProgress.done',
			'settings': AProgress.settings
		});
	};

	Element.prototype.triggerEvent = function (name, data) {
		var evt;
		if (document.CustomEvent) {
			evt = new CustomEvent(name, data);	
		} else {
			evt = document.createEvent('CustomEvent');
			evt.initCustomEvent(name, true, true, data);
		}
		this.dispatchEvent(evt);
	};

	Object.values = function (obj) {
		var array = new Array(),
			prop;

		for (prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				array.push(obj[prop]);
			}
		}
		return array;
	};

	function addDots(parent, number) {
		var cssKeys = Object.keys(Settings.dot.css), 
			cssValues = Object.values(Settings.dot.css),
			length = cssKeys.length,
			element, 
			i, 
			j; 

		for (i = 0; i < number; i++) {
			element = document.createElement('div');
			element.setAttribute('role', 'dot');
			Settings.dot.selectorSign === '.' ? element.classList.add(Settings.dot.selectorName) : element.id = Settings.dot.selectorName;
			for (j = 0; j < length; j++) {
				element.style[cssKeys[j]] = cssValues[j];
			}
			parent.appendChild(element);
		}
	}

	function addBar() {
		var template = document.createElement('div'),
			parent = Settings.parent,
			cssKeys = Object.keys(Settings.bar.css), 
			cssValues = Object.values(Settings.bar.css),
			length = cssKeys.length, 
			i;
			
		Settings.bar.selectorSign === '.' ? template.classList.add(Settings.bar.selectorName) : template.id = Settings.bar.selectorName;
		template.setAttribute('role', Settings.role);
		template.style.visibility = 'hidden';

		for (i = 0; i < length; i++) {
			template.style[cssKeys[i]] = cssValues[i];
		}

		document.querySelector('body').appendChild(template);

		return template;	
	}

	function addCssAnimation() {
		var cssAnimation = document.createElement('style'),
			rules;
		cssAnimation.type = 'text/css';
		cssAnimation.id = 'css-animation';
		rules = document.createTextNode('@' + getVendorPrefix() + 'keyframes ' + Settings.animation.name + ' {\n' +
			buildAnimationPercentage() +
			'}');
		cssAnimation.appendChild(rules);
		rules = document.createTextNode('.' + Settings.animation.className + '{\n' +
    		'\t' + getVendorPrefix() + 'animation-name: ' + Settings.animation.name + ';\n' +
    		'\t' + getVendorPrefix() + 'animation-duration:' + Settings.animation.duration + ';\n' +
    		'\t' + getVendorPrefix() + 'animation-iteration-count: infinite;\n' +
			'}');
		cssAnimation.appendChild(rules);
		document.getElementsByTagName('head')[0].appendChild(cssAnimation);
	}

	function buildAnimationPercentage() {
		var str = '',
			tab = '\t',
			newLine = '\n',
			stepsKeys = Object.keys(Settings.animation.steps),
			stepsValues = Object.values(Settings.animation.steps),
			length = stepsKeys.length,
			i;

		for (i = 0; i < length; i++) {
			str += tab + stepsKeys[i] + ' { left: ' + stepsValues[i] + ' }' + newLine;
		}


		return str;
	}

	function extend(out) {
		out = out || {};

		for (var i = 1; i < arguments.length; i++) {
			if (!arguments[i]) 
				continue;

			for (var key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key)) 
					out[key] = arguments[i][key];
			}
		}

  		return out;	
	}

	function getVendorPrefix() {
		var ua;
		ua = navigator.userAgent;
		if (ua.indexOf("Opera") !== -1) {
		    return "-o-";
		} else if (ua.indexOf("MSIE") !== -1) {
		    return "-ms-";
		} else if (ua.indexOf("WebKit") !== -1) {
		    return "-webkit-";
		} else {
		    return "";
		}	
	}

	return AProgress;
})();