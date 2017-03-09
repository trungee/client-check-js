var Finform = Finform || {};

Finform.ClientCheckConfigs = {
    LastestBrowserVersion: {
        Chrome: 56,
        Firefox: 52,
        Opera: 0
    },
    VulnerableBrowserVersions: {
        Chrome: ['55.2', '56.0.2924.57'],
        Firefox: ['52.2'],
        Opera: ['52.2']
    }
}


Finform.ClientCheck = {
	versionCompareOtions: {
		zeroExtend: true
	},
	Chrome: {
		lastestVersion: Finform.ClientCheckConfigs.LastestBrowserVersion.Chrome,
		vulnerableVersions: Finform.ClientCheckConfigs.VulnerableBrowserVersions.Chrome,
		chromeRaw: undefined,
		isChrome: function() {
			// please note, 
			// that IE11 now returns undefined again for window.chrome
			// and new Opera 30 outputs true for window.chrome
			// and new IE Edge outputs to true now for window.chrome
			// and if not iOS Chrome check
			// so use the below updated condition
			var _self = Finform.ClientCheck.Chrome.isChrome;
			var isChromium = window.chrome,
			    winNav = window.navigator,
			    vendorName = winNav.vendor,
			    isOpera = winNav.userAgent.indexOf("OPR") > -1,
			    isIEedge = winNav.userAgent.indexOf("Edge") > -1,
			    isIOSChrome = winNav.userAgent.match("CriOS");
			if(isIOSChrome){
				_self.isChrome = false;
			} else if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
				_self.isChrome = true;
			} else { 
			   _self.isChrome = false; 
			}
			return _self.isChrome;
		},
		_inspectUserAgent: function() {
			this.chromeRaw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\.(\d|\.)*/);
		},
		getVersion: function() {
			this._inspectUserAgent();
			return this.chromeRaw[0].split('/')[1];
		},
		getIntVersion: function() {
			this._inspectUserAgent();
		    return this.chromeRaw ? parseInt(this.chromeRaw[2], 10) : false;
		}
	},
	Firefox: {
		lastestVersion: Finform.ClientCheckConfigs.LastestBrowserVersion.Chrome,
		vulnerableVersions: Finform.ClientCheckConfigs.VulnerableBrowserVersions.Firefox,
		isFirefox: function() {
			return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
		},
		getIntVersion: function() {
			return 52;
		},
		getVersion: function() {
			return '52.2';
		}
	},
	Opera: {
		isOpera: function() {
			
		}
	},
	isSafeBrowser: function() {
		if (this.Chrome.isChrome()) {
			return (this._isUpToDate(this.Chrome.getIntVersion.bind(this.Chrome), this.Chrome.lastestVersion) && !this._isVulnerableVersion(this.Chrome.getVersion(), this.Chrome.vulnerableVersions));
		} else if (this.Firefox.isFirefox()) {
			return (this._isUpToDate(this.Firefox.getIntVersion, this.Firefox.lastestVersion) && !this._isVulnerableVersion(this.Firefox.getVersion(), this.Firefox.vulnerableVersions));
		} else if (this.Opera.isOpera()) {
			return true;
		}
		return false;
	},
	_isUpToDate: function(getBrowserVersion, lastestVersion) {
		return getBrowserVersion() >= lastestVersion -1;
	},
	_isVulnerableVersion: function(currentVersion, vulnerableVersions) {
		for (i = 0; i < vulnerableVersions.length; i++) {
			if (versionCompare(currentVersion, vulnerableVersions[i].toString(), this.versionCompareOtions) == 0) {
				return true;
			}
		}
		return false;
	},
}

/**
 * Compares two software version numbers (e.g. "1.7.1" or "1.2b").
 *
 * This function was born in http://stackoverflow.com/a/6832721.
 *
 * @param {string} v1 The first version to be compared.
 * @param {string} v2 The second version to be compared.
 * @param {object} [options] Optional flags that affect comparison behavior:
 * <ul>
 *     <li>
 *         <tt>lexicographical: true</tt> compares each part of the version strings lexicographically instead of
 *         naturally; this allows suffixes such as "b" or "dev" but will cause "1.10" to be considered smaller than
 *         "1.2".
 *     </li>
 *     <li>
 *         <tt>zeroExtend: true</tt> changes the result if one version string has less parts than the other. In
 *         this case the shorter string will be padded with "zero" parts instead of being considered smaller.
 *     </li>
 * </ul>
 * @returns {number|NaN}
 * <ul>
 *    <li>0 if the versions are equal</li>
 *    <li>a negative integer iff v1 < v2</li>
 *    <li>a positive integer iff v1 > v2</li>
 *    <li>NaN if either version string is in the wrong format</li>
 * </ul>
 *
 * @copyright by Jon Papaioannou (["john", "papaioannou"].join(".") + "@gmail.com")
 * @license This function is in the public domain. Do what you want with it, no strings attached.
 */
function versionCompare(v1, v2, options) {
    var lexicographical = options && options.lexicographical,
        zeroExtend = options && options.zeroExtend,
        v1parts = v1.split('.'),
        v2parts = v2.split('.');

    function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
    }

    if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) {
            return 1;
        }

        if (v1parts[i] == v2parts[i]) {
            continue;
        }
        else if (v1parts[i] > v2parts[i]) {
            return 1;
        }
        else {
            return -1;
        }
    }

    if (v1parts.length != v2parts.length) {
        return -1;
    }

    return 0;
}