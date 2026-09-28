/* ============================================================
   Tenno transliteration for the portfolio.
   Glyph artwork and the phonetic/layout algorithm are adapted from
   Clarvel's TennoTyper (https://clarvel.github.io/TennoTyper/).
   ============================================================ */
(function () {
    'use strict';

    function find(item, array) {
        for (var a = 0; a < array.length; a++) {
            if (item == array[a]) return true;
        }
        return false;
    }

    var phonet = true;

var tenno = new function(){
	this.folder = "./tenno/";
	this.pre = 't';
	this.ext = ".png";

	this.recalc = true; // whether recalculations are required
	this.currWord = "";
	this.currWordArray = [];
	this.dim = [0, 0, 0, 0]; // array with: Width, height, drawline offset, startpoint offset

	this.centered = true;
	this.rot = 24.3 * Math.PI / 180;
	this.spacing = {
		LineHeight: 15,
		SpaceWidth: 20,
		LetterSpacing: 0,
	};

	this.vowels = ['a', 'e', 'i', 'o', 'u', 'w', 'y', 'ee', 'aw', 'oo', 'ae', 'aye', 'ow'];
	this.misc = [',', '.', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

	this.imgs = [];
	this.chars = ['aye', 'ae', 'ow', 'aw', 'ee', 'i', 'e', 'a', 'u', 'oo' , 'o', 'th', 'dh', 'sh', 'zh', 'ch', 'kh', 'ng', 'p', 'b', 't', 'd', 's', 'z', 'j', 'k', 'g', 'f', 'v', 'm', 'n', 'h', 'r', 'l', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', "Period", "Comma", "Hyphen"];
	for(var a = 0; a < this.chars.length; a++){
		switch(this.chars[a]){
			case 'Comma':
				this.imgs[','] = new Image();
				this.imgs[','].src = this.folder + this.pre + this.chars[a] + this.ext;
				this.chars[a] = ',';
				break;
			case 'Hyphen':
				this.imgs['-'] = new Image();
				this.imgs['-'].src = this.folder + this.pre + this.chars[a] + this.ext;
				this.chars[a] = '-';
				break;
			case 'Period':
				this.imgs['.'] = new Image();
				this.imgs['.'].src = this.folder + this.pre + this.chars[a] + this.ext;
				this.chars[a] = '.';
				break;
			default:
				this.imgs[this.chars[a]] = new Image();
				this.imgs[this.chars[a]].src = this.folder + this.pre + this.chars[a] + this.ext;
		}
	}

	this.placeWord = function(ctx, word){ // place centered images
		if(this.recalc || this.currWord != word){
			this.currWord = word;
			this.currWordArray = this.phoneticize(word);
			this.dim = this.getWordDimensions(word);
			this.recalc = false;
		}

		var pCha = 0; // prevchar, 1 = misc, 2 = vowel, 3 = consonant
		var xOff = this.dim[3]; // x offset
		var yOff = this.dim[2]; // y offset, initially set to drawline offset
		var exta = 0; // extra var placeholder
		var ref; // image array refrence var
		var img; // image var

		for(var a = 0; a < this.currWordArray.length; a++){
			ref = this.currWordArray[a];
			img = this.imgs[ref]; // set img var
			if(img != undefined){
				if(find(ref, this.misc)){ // misc
					if(exta > 0){ // if previous char was consonant and consonant drew below drawline, add spacing
						var tmp = img.height / Math.tan(this.rot);
						if(exta > tmp){
							xOff += tmp;
						}else{
							xOff += exta;
						}
						exta = 0;
					}else if(-exta > img.width){ // update exta var, to prevent vowel overlap
						exta += img.width;
					}else{
						exta = 0;
					}

					ctx.rect(xOff, yOff, img.width, img.height);
					ctx.drawImage(img, xOff, yOff);

					xOff += img.width; // add to width

					pCha = 1;
				}else if(find(ref, this.vowels)){ // vowel
					var mWid = img.width;
					var b = a;
					a++;
					while(find(this.currWordArray[a], this.vowels)){ // get max dimensions
						img = this.imgs[this.currWordArray[a]];
						mWid += img.width + this.spacing.LetterSpacing;
						a++;
					}
					a--; // account for extra increment
					mWid -= this.spacing.LetterSpacing;

					if(pCha == 0){ // if vowel is first char
						xOff += mWid * Math.cos(this.rot);
					}

					if(exta < 0){
						if(mWid >= -exta){
							xOff -= exta;
						}else{
							xOff += mWid * Math.cos(this.rot) + (-exta) * Math.sin(this.rot) * Math.sin(this.rot);
						}
					}
					ctx.translate(xOff, yOff);
					ctx.rotate(this.rot);

					for(; b <= a; b++){ // for each vowel
						img = this.imgs[this.currWordArray[b]];
						ctx.rect(-mWid, -img.height, img.width, img.height);
						ctx.drawImage(img, -mWid, -img.height);
						mWid -= img.width + this.spacing.LetterSpacing;
					}

					ctx.rotate(-this.rot);
					ctx.translate(-xOff, -yOff);

					var off = mWid * Math.cos(this.rot);
					if(exta < 0){ // update width
						if(-exta < off){
							xOff -= exta;
						}else{
							xOff += off;
						}
						exta = 0;
					}

					pCha = 2;
				}else{ // cosonant
					ctx.translate(xOff, yOff);
					ctx.rotate(this.rot);

					ctx.rect(0, -img.height, img.width, img.height);
					ctx.drawImage(img, 0, -img.height);

					ctx.rotate(-this.rot);
					ctx.translate(-xOff, -yOff);

					// update width vars
					var b = img.height / Math.sin(this.rot); // xOff if this ends below drawline
					var c = img.width / Math.cos(this.rot); // xOff is this ends above drawline
					if(b < c){
						xOff += b;
						exta = (c-b) * Math.cos(this.rot)*Math.cos(this.rot);
					}else{
						xOff += c;
						exta = (c-b);
					}

					pCha = 3;
				}
			}
			xOff += this.spacing.LetterSpacing;
		}
	}

	this.getWordLength = function(word){
		if(this.recalc || word != this.currWord){// so I dont have to phoneticize several times on same word
			this.dim = this.getWordDimensions(word);
		}
		return this.dim[0];
	}

	this.getWordHeight = function(word){
		if(this.recalc || word != this.currWord){// so I dont have to phoneticize several times on same word
			this.dim = this.getWordDimensions(word);
		}
		return this.dim[1];
	}

	this.getWordHeightOffset = function(word){
		if(this.recalc || word != this.currWord){// so I dont have to phoneticize several times on same word
			this.dim = this.getWordDimensions(word);
		}
		return this.dim[2];
	}

	this.getWordDimensions = function(word){
		if(this.recalc || this.currWord != word){
			this.currWord = word;
			this.currWordArray = this.phoneticize(word);
			this.recalc = false;
		}

		var pCha = 0; // prevchar, 1 = misc, 2 = vowel, 3 = consonant
		var netW = 0; // x offset
		var staW = 0; // starting xOffset
		var tail = 0; // trailing required whitespace
		var uHei = 0; // upper y offset from drawline
		var dHei = 0; // lower y offset from drawline
		var exta = 0; // extra var placeholder
		var ref; // image array refrence var
		var img; // image var

		for(var a = 0; a < this.currWordArray.length; a++){
			ref = this.currWordArray[a];
			img = this.imgs[ref]; // set img var
			if(img != undefined){
				if(find(ref, this.misc)){ // misc
					if(exta > 0){ // if previous char was consonant and consonant drew below drawline, add spacing
						netW += exta;
						exta = 0;
					}else if(-exta > img.width){ // update exta var, to prevent vowel overlap
						exta += img.width;
					}else{
						exta = 0;
					}
					netW += img.width; // add to width

					if(dHei < img.height){ // update height if neccesary
						dHei = img.height;
					}

					tail = 0;
					pCha = 1;
				}else if(find(ref, this.vowels)){ // vowel
					var dim = [img.width, img.height];
					a++;
					while(find(this.currWordArray[a], this.vowels)){ // get max dimensions
						img = this.imgs[this.currWordArray[a]];
						dim[0] += img.width + this.spacing.LetterSpacing;
						if(dim[1] < img.height){
							dim[1] = img.height;
						}
						a++;
					}
					a--; // account for extra increment
					dim[0] -= this.spacing.LetterSpacing;
					var off = dim[0] * Math.cos(this.rot);
					var pTail = img.height * Math.sin(this.rot); // potential tail, img should be the last vowel
					if(exta < 0){ // update width for consonant above drawline
						if(-exta < off){
							netW -= exta;
						}else{
							if(dim[0] > -exta){
								netW += off;
							}else{
								netW += dim[0] * Math.cos(this.rot) + (-exta) * Math.sin(this.rot) * Math.sin(this.rot);
							}
						}
						exta = 0;
						tail = pTail; // update tail
					}else{ // if positive exta, tail is below drawline
						if(tail < pTail){ // test how to update tail
							tail = pTail;
						}
					}

					// setup starting width offset and update width based on previous char and offset
					if(pCha == 0){
						netW += off;
					}else if(netW < off){
						staW = off - netW;
						netW += off - netW;
					}else{
						staW = 0;
					}

					//only approximate, more accurate in future versions?
					var pHei = dim[0] * Math.sin(this.rot) + dim[1] * Math.cos(this.rot); // update height var
					if(pHei > uHei){
						uHei = pHei;
					}

					pCha = 2;
				}else{ // cosonant
					// update width vars
					var b = img.height / Math.sin(this.rot); // xOff if this ends below drawline
					var c = img.width / Math.cos(this.rot); // xOff is this ends above drawline
					if(b < c){ // tail below drawline
						netW += b;
						exta = (c-b) * Math.cos(this.rot) * Math.cos(this.rot);
						if(tail < b + exta){
							tail = exta;
						}else{
							tail -= b;
						}
					}else{ // if tail is above drawline
						netW += c;
						exta = (c-b);
						var tmp = -exta * Math.sin(this.rot) * Math.sin(this.rot);
						if(tail < c + tmp){
							tail = tmp;
						}else{
							tail -= c;
						}
					}

					// update height vars
					var tmpH = img.height * Math.cos(this.rot);
					if(tmpH > uHei){
						uHei = tmpH;
					}
					tmpH = img.width * Math.sin(this.rot);
					if(tmpH > dHei){
						dHei = tmpH;
					}

					pCha = 3;
				}
			}
			netW += this.spacing.LetterSpacing;
		}
		netW -= this.spacing.LetterSpacing; // account for extra LetterSpacing
		var out = [netW + tail, uHei + dHei, uHei, staW];
		return out; // return array containing width, height, drawline offset
	}

	this.literal = function(word){
		var array = []
		var found;
		var a = 0;
		while(a < word.length){
			found = false;
			switch(word[a]){
				case 'y':
					array.push('ee');
					break;
				case 'w':
					array.push('oo');
					break;
				case 'c':
					if(!(a < word.length-1 && word[a+1] == 'h')){
						array.push('k');
						break;
					}
				default:
					for(var b = 0; b < this.chars.length; b++){
						test = word.indexOf(this.chars[b], a);
						if(test == a){
							array.push(this.chars[b]);
							a += this.chars[b].length;
							b = this.chars.length+1;
							found = true;
						}
					}
			}
			
			if(!found){
				a++;
			}
		}
		return array;
	}

	this.phoneticize = function(word){ // return array of phoneticized chars, according to phoneticizeGuide.txt
		var wordsArray = [];

		if(!phonet){
			wordsArray = this.literal(word);
			return wordsArray;
		}

		for(var a = 0; a < word.length; a++){
			if(a < word.length-1){ // if there is at least 1 char after a
				var b = true; // true if program should break out of following main switch, only becomes false for fallthrough
				switch(word[a]){
				//handle special cases where singletons are not directly matched
					case 'c':
						switch(word[a+1]){
							case 'h':
								if(a > 0 && find(word[a-1], this.vowels)){
									wordsArray.push('kh');
									break;
								}
								wordsArray.push('ch');
								break;
							case 'o':
								if(a < word.length-2 && word[a+2] == 'u'){
									wordsArray.push(word[a]);
									wordsArray.push('ow');
									a++; // account for removing 3 chars
									break;
								}
							default:
								wordsArray.push('k');
								a--; // account for only removing 1 char
						}
						a++;
						b = false;
						break;
					case 'o':
						switch(word[a+1]){
							case 'o':
							case 'u':
								wordsArray.push('oo');
								break;
							case 'w':
								wordsArray.push('ow');
								break;
							default:
								if(find(word[a+1], this.vowels) || find(word[a+1], this.misc) || word[a+1] == 'l'){
									wordsArray.push('o');
								}else{
									wordsArray.push('aw');
								}
								a--;
						}
						a++;
						b = false;
						break;
					case 'w':
						wordsArray.push('oo');
						if(word[a+1] == 'a'){
							wordsArray.push('o');
							a++;
						}
						b = false;
						break;
					case 'y':
						switch(word[a+1]){
							case 'i':
								wordsArray.push('aye');
								a++;
								break;
							case 'o':
								if(a < word.length-2 && word[a+2] == 'u'){
									if(word.length == 3 || find(word[a+3], this.misc)){
										wordsArray.push('ee');
										wordsArray.push('oo');
										wordsArray.push('h');
										a += 2;
										break;
									}
								}
							default:
								wordsArray.push('ee');
						}
						b = false;
						break;

				//handle normal cases
					case 'a':
						switch(word[a+1]){
							case 'e':
							case 'i':
								wordsArray.push('ae');
								a++
								b = false;
								break;
							case 'y':
								if(a < word.length-2 && word[a+2] == 'e'){
									wordsArray.push('aye');
									a += 2;
									b = false;
									break;
								}
								wordsArray.push('ae');
								a++
								b = false;
								break;
							case 'w':
								wordsArray.push('aw');
								a++;
								b = false;
								break;
							case 's':
								wordsArray.push('zh');
								a++;
								b = false;
								break;
							default:
								if(a < word.length-2 && word[a+2] == 'e'){
									if(!(find(word[a+1], this.vowels) || find(word[a+1], this.misc))){ // if consonant
										if(word[a+1] == 'r'){
											wordsArray.push('aw');
										}else{
											wordsArray.push('ae');
										}
										b = false;
										break;
									}
								}
						}
						break;
					case 'b':
						if(a < word.length-2 && word[a+2] == 'u'){
							if(word[a+1] == 'o'){
								wordsArray.push('b');
								wordsArray.push('ow');
								a += 2;
								b = false;
							}
						}
						break;
					case 'd':
						switch(word[a+1]){
							case 'h':
								wordsArray.push('dh');
								a++;
								b = false;
								break;
							case 'o':
								if(a < word.length-2 && word[a+2] == 'u'){
									wordsArray.push(word[a]);
									wordsArray.push('ow');
									a += 2; // account for removing 3 chars
									b = false;
								}
							default:
						}
						break;
					case 'e':
						switch(word[a+1]){
							case 'a':
							case 'e':
								wordsArray.push('ee');
								a++;
								b = false;
								break;
							default:
						}
						break;
					case 'g':
						if(word[a+1] == 'e'){
							wordsArray.push('j');
							wordsArray.push('i');
							a++;
							b = false;
						}
						break;
					case 'i':
						if(word[a+1] == 'e'){
							wordsArray.push('aye');
							a++;
							b = false;
						}else if(word[a+1] == 'a'){
							wordsArray.push('ee');
							b = false;
						}else if(a < word.length-2 && word[a+2] == 'e' && !find(word[a+3], this.vowels)){
							if(!find(word[a+1], this.vowels) && !find(word[a+1], this.misc)){
								wordsArray.push('aye');
								b = false;
							}
						}
						break;
					case 'n':
						if(a == word.length-2 && word[a+1] == 'g'){
							wordsArray.push('ng');
							a++;
							b = false;
						}
						break;
					case 's':
						if(word[a+1] == 'h'){
							wordsArray.push('sh');
							a++;
							b = false;
						}
						break;
					case 't':
						if(word[a+1] == 'h'){
							wordsArray.push('th');
							if(a < word.length-2 && word[a+2] == 'e'){
								if(word.length == 3 || find(word[a+3], this.misc)){
									wordsArray.push('u');
									wordsArray.push('h');
									a++;
								}
							}
							a++;
							b = false;
						}else if(a < word.length-3){
							if(word[a+1] == 'i' && word[a+2] == 'o' && word[a+3] == 'n'){
								wordsArray.push('sh');
								wordsArray.push('u');
								wordsArray.push('m');
								a += 3;
								b = false;
							}
						}
						break;
					case 'u':
						if(a < word.length-2){
							if(!(find(word[a+1], this.vowels) || find(word[a+1], this.misc))){ // if a+1 = consonant
								if(find(word[a+2], this.vowels)){ // if a+2 = vowel
									wordsArray.push('oo');
									b = false;
									break;
								}
							}
						}
						break;
					default:
				}
				if(b){ // true by default
					wordsArray.push(word[a]);
				}
			}else{ // a is the last char in word
				switch(word[a]){
					case 'c':
						wordsArray.push('k');
						break;
					case 'e': // e[end] = silent
						if(a == 0){ // e is the only letter
							wordsArray.push('e');
						}
						break;
					case 'o':
						wordsArray.push('o');
						break;
					case 'w':
						wordsArray.push('oo');
						break;
					case 'x':
						wordsArray.push('z');
						break;
					case 'i':
						if(a == 0){ // if 'i' is the only letter
							wordsArray.push('aye');
						}else{
							wordsArray.push('i');
						}
						break;
					case 'y': // y[end] = aye
						wordsArray.push('aye');
						break;
					default:
						wordsArray.push(word[a]);
				}
			}
		}

		var a = 0; // remove duplicates and any undefined chars from the array
		while(a < wordsArray.length){
			if(!find(wordsArray[a], this.misc)){
				while(a < wordsArray.length-1 && wordsArray[a] == wordsArray[a+1]){
					wordsArray.splice(a, 1); // remove duplicates
				}
			}
			if(this.imgs[wordsArray[a]] == undefined){ // remove undefined chars
				wordsArray.splice(a, 1);
			}
			a++;
		}

		return wordsArray;
	}
}

    /* ============================================================
       Portfolio DOM integration
       Replaces visible words with Tenno-glyph canvases.
       ============================================================ */

    var glyphChars = ['aye', 'ae', 'ow', 'aw', 'ee', 'i', 'e', 'a', 'u', 'oo', 'o',
        'th', 'dh', 'sh', 'zh', 'ch', 'kh', 'ng', 'p', 'b', 't', 'd', 's', 'z',
        'j', 'k', 'g', 'f', 'v', 'm', 'n', 'h', 'r', 'l',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',', '-'];

    var glyphsReady = false;
    var preloading = false;
    var active = false;
    var restoreList = [];

    var BASE = 44; // native reference height of the glyph set
    var SIZE_MULT = 1.0; // Tenno glyph scale

    function preload(cb) {
        if (glyphsReady) { cb(); return; }
        if (preloading) { return; }
        preloading = true;
        var pending = glyphChars.length;
        var step = function () {
            if (--pending <= 0) { glyphsReady = true; preloading = false; cb(); }
        };
        glyphChars.forEach(function (ch) {
            var img = tenno.imgs[ch];
            if (!img) { step(); return; }
            if (img.complete && img.naturalWidth) { step(); }
            else {
                img.addEventListener('load', step);
                img.addEventListener('error', step);
            }
        });
    }

    function colorFor(el) {
        var c = getComputedStyle(el).color || '';
        var m = c.match(/rgba?\(([^)]+)\)/);
        if (m) {
            var parts = m[1].split(',').map(function (s) { return parseFloat(s); });
            if (parts.length >= 4 && parts[3] < 0.15) return '#d4af37';
        }
        if (c === 'transparent') return '#d4af37';
        return c;
    }

    function renderWord(word, scale, color) {
        var dim = tenno.getWordDimensions(word);
        var w = Math.max(1, dim[0]);
        var h = Math.max(1, dim[1]);
        var dpr = Math.min(window.devicePixelRatio || 1, 2);

        var cv = document.createElement('canvas');
        cv.width = Math.max(1, Math.ceil(w * scale * dpr));
        cv.height = Math.max(1, Math.ceil(h * scale * dpr));

        var ctx = cv.getContext('2d');
        ctx.scale(scale * dpr, scale * dpr);
        ctx.translate(0, dim[2]);
        tenno.placeWord(ctx, word);

        // Tint the black glyph art with the element's text colour
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.globalCompositeOperation = 'source-over';

        // Crop the transparent padding around the glyphs. The layout box is
        // much taller than the visible ink (rotated glyphs), so leaving it
        // uncropped inflates every line's height.
        var sx = 0, sy = 0, sw = cv.width, sh = cv.height;
        try {
            var data = ctx.getImageData(0, 0, cv.width, cv.height).data;
            var minX = cv.width, minY = cv.height, maxX = -1, maxY = -1;
            for (var y = 0; y < cv.height; y++) {
                var row = y * cv.width * 4;
                for (var x = 0; x < cv.width; x++) {
                    if (data[row + x * 4 + 3] > 8) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }
            if (maxX >= 0) {
                sx = minX; sy = minY;
                sw = maxX - minX + 1;
                sh = maxY - minY + 1;
            }
        } catch (e) { /* keep the full canvas if pixel access is unavailable */ }

        var out = document.createElement('canvas');
        out.width = sw;
        out.height = sh;
        out.getContext('2d').drawImage(cv, sx, sy, sw, sh, 0, 0, sw, sh);

        // Keep the glyphs sitting on the text baseline after cropping.
        var baselineInCrop = (dim[2] * scale * dpr - sy) / dpr;
        var cssH = sh / dpr;
        out.style.width = (sw / dpr) + 'px';
        out.style.height = cssH + 'px';
        out.style.verticalAlign = (baselineInCrop - cssH) + 'px';
        out.className = 'tenno-word';
        return out;
    }

    var SKIP_TAGS = {
        SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CANVAS: 1, SVG: 1, IFRAME: 1,
        TEXTAREA: 1, INPUT: 1, SELECT: 1, OPTION: 1, CODE: 1
    };

    function isSkipped(el) {
        if (!el || !el.tagName) return true;
        if (SKIP_TAGS[el.tagName]) return true;
        if (el.closest && el.closest('[data-tenno-skip]')) return true;
        return false;
    }

    function transliterate(node) {
        var text = node.nodeValue;
        var parent = node.parentNode;
        var color = colorFor(parent);
        var scale = ((parseFloat(getComputedStyle(parent).fontSize) || 16) / BASE) * SIZE_MULT;

        var parts = text.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var cv = renderWord(part.toLowerCase(), scale, color);
            restoreList.push({ canvas: cv, text: part });
            frag.appendChild(cv);
        });
        parent.replaceChild(frag, node);
    }

    function enable() {
        if (active) return;
        if (!glyphsReady) { preload(enable); return; }
        active = true;
        restoreList = [];
        document.body.classList.add('tenno-active');

        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                if (isSkipped(node.parentElement)) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        var nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(transliterate);
    }

    function disable() {
        if (!active) return;
        active = false;
        document.body.classList.remove('tenno-active');
        restoreList.forEach(function (r) {
            if (r.canvas.parentNode) r.canvas.replaceWith(document.createTextNode(r.text));
        });
        restoreList = [];
    }

    window.Tenno = {
        enable: enable,
        disable: disable,
        isActive: function () { return active; }
    };
})();
