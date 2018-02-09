AFRAME.registerSystem('font-awesome', {
    schema: {
        timeout: { type: 'number', default: 2500 }
    },

    cache: {},
    promises: {},

    loaded: false,
    promise: null,

    draw: function(data) {
        const key = [data.charcode, data.color, data.size].join('-');
        if(!this.cache[key]) {
            const size = data.size;

            const canvas=document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx=canvas.getContext("2d");

            const fontSize = 800 / (1024 / size);
            const position = size / 2;

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = data.color;
            ctx.font= fontSize + 'px FontAwesome';
            ctx.fillText(String.fromCharCode('0x' + data.charcode),position,position);

            this.cache[key] = canvas.toDataURL();
        }

        return this.cache[key];
    },

    isStylesheetLoaded: function() {
        if(this.loaded) {
            return Promise.resolve();
        }

        if(this.isFontAwesomeAvailable()) {
            this.onLoaded();
            return Promise.resolve();
        }

        if(!this.promise) {
            this.promise = new Promise((resolve) => {
                if(this.canCheckDocumentFonts()) {
                    const func = () => {
                        if (this.isFontAwesomeAvailable()) {
                            document.fonts.removeEventListener('loadingdone', func)
                            this.onLoaded(resolve);
                        }
                    };
                    document.fonts.addEventListener('loadingdone', func);
                } else {
                    console.warn('aframe-font-awesome: Unable to determine when FontAwesome stylesheet is loaded. Drawing fonts after ' + this.data.timeout + ' seconds');
                    console.warn('aframe-font-awesome: You can change the timeout by adding "font-awesome="timeout: $timeout" to your a-scene')

                    window.setTimeout(() => {
                        this.onLoaded(resolve);
                    }, this.data.timeout);
                }
            });
        }

        return this.promise;
    },

    isFontAwesomeAvailable: function() {
        return this.canCheckDocumentFonts() && document.fonts.check('1px FontAwesome');
    },

    canCheckDocumentFonts: function() {
        return typeof document.fonts !== 'undefined' && document.fonts.check;
    },

    onLoaded: function(resolve) {
        this.el.emit('font-awesome.loaded');
        this.loaded = true;

        if(resolve) {
            resolve();
        }
    }
});

AFRAME.registerComponent('font-awesome', {
    schema: {
        charcode: { type: 'string' },
        color: { default: '#000', type: 'string' },
        size: { default: '1024', type: 'number' },
        visibleWhenDrawn: { default: 'true', 'type': 'boolean' },
    },

    update: function() {
        if(this.data.visibleWhenDrawn) {
            this.el.setAttribute('visible', 'false');
        }

        this.system.isStylesheetLoaded().then(function() {
            const result = this.system.draw(this.data);
            this.el.setAttribute('src', result);
            this.el.emit('font-awesome.drawn');

            if(this.data.visibleWhenDrawn) {
                setTimeout(() => this.el.setAttribute('visible', 'true'));
            }
        }.bind(this));
    }
});

AFRAME.registerPrimitive('a-font-awesome', {
    defaultComponents: {
        'geometry': { 'primitive': 'plane' },
        'material': { 'side': 'double', 'transparent': 'true' },
    },

    // Maps HTML attributes to the `ocean` component's properties.
    mappings: {
        charcode: 'font-awesome.charcode',
        color: 'font-awesome.color',
        size: 'font-awesome.size',
        src: 'material.src',
    }
});