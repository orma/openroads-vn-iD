iD.ui = function(context) {
    function render(container) {
        var map = context.map();

        if (iD.detect().opera) container.classed('opera', true);

        container.append('svg')
            .attr('id', 'defs')
            .call(iD.svg.Defs(context));

        container.append('div')
            .attr('id', 'sidebar')
            .attr('class', 'col4')
            .call(ui.sidebar);

        var content = container.append('div')
            .attr('id', 'content');

        var bar = content.append('div')
            .attr('id', 'bar');

        var m = content.append('div')
            .attr('id', 'map')
            .call(map);

        var hash = iD.behavior.Hash(context);

        hash();

        if (!hash.hadHash) {
            map.centerZoom([122.725,11.638], 7);
        }

        /*
        bar.append('div')
            .attr('class', 'spacer col4');

        var limiter = bar.append('div')
            .attr('class', 'limiter');

        limiter.append('div')
            .attr('class', 'button-wrap joined col3')
            .call(iD.ui.Modes(context), limiter);

        limiter.append('div')
            .attr('class', 'button-wrap joined col1')
            .call(iD.ui.UndoRedo(context));

        limiter.append('div')
            .attr('class', 'button-wrap col1')
            .call(iD.ui.Save(context));

        bar.append('div')
            .attr('class', 'spinner')
            .call(iD.ui.Spinner(context));
        */

        var mapControls = bar.append('div')
            .attr('class', 'map-controls');

        mapControls.append('div')
            .attr('class', 'layer-control zoombuttons')
            .call(iD.ui.Zoom(context));

        mapControls.append('div')
            .attr('class', 'layer-control geolocate-control')
            .call(iD.ui.Geolocate(map));

        var layerControls = bar.append('div')
            .attr('class', 'layer-controls');

        layerControls.append('div')
            .attr('class', 'layer-control background-control')
            .call(iD.ui.Background(context));

        layerControls.append('div')
            .attr('class', 'layer-control map-overlay-control')
            .call(iD.ui.MapOverlay(context));

        layerControls.append('div')
            .attr('class', 'layer-control add-buttons')
            .call(iD.ui.Modes(context), layerControls);

        layerControls.append('div')
            .attr('class', 'layer-control undo-redo')
            .call(iD.ui.UndoRedo(context));

        layerControls.append('div')
            .attr('class', 'layer-control save-button')
            .call(iD.ui.Save(context));

        // OR
        // layerControls.append('div')
            // .attr('class', 'layer-control help-control')
            // .call(iD.ui.Help(context));

        var about = content.append('div')
            .attr('id', 'about');

        // OR
        // about.append('div')
            // .attr('id', 'attrib')
            // .call(iD.ui.Attribution(context));

        var footer = about.append('div')
            .attr('id', 'footer')
            // OR
            // .attr('class', 'fillD');

        // OR
        footer.append('div')
            .attr('id', 'attrib')
            .call(iD.ui.Attribution(context));

        footer.append('div')
            .attr('id', 'scale-block')
            .call(iD.ui.Scale(context));

        var aboutList = footer.append('div')
            .attr('id', 'info-block')
            .append('ul')
            .attr('id', 'about-list');

        if (!context.embed()) {
            aboutList.call(iD.ui.Account(context));
        }

        aboutList.append('li')
            .append('a')
            .attr('target', '_blank')
            .attr('tabindex', -1)
            .attr('href', 'http://github.com/openstreetmap/iD')
            .text(iD.version);

        var bugReport = aboutList.append('li')
            .append('a')
            .attr('target', '_blank')
            .attr('tabindex', -1)
            .attr('href', 'https://github.com/openstreetmap/iD/issues');

        bugReport.append('span')
            .attr('class','icon bug light');

        bugReport.call(bootstrap.tooltip()
                .title(t('report_a_bug'))
                .placement('top')
            );

        aboutList.append('li')
            .attr('class', 'feature-warning')
            .attr('tabindex', -1)
            .call(iD.ui.FeatureInfo(context));

        aboutList.append('li')
            .attr('class', 'user-list')
            .attr('tabindex', -1)
            .call(iD.ui.Contributors(context));

        footer.append('div')
            .attr('class', 'api-status')
            .call(iD.ui.Status(context));

        window.onbeforeunload = function() {
            return context.save();
        };

        window.onunload = function() {
            context.history().unlock();
        };

        d3.select(window).on('resize.editor', function() {
            map.dimensions(m.dimensions());
        });

        function pan(d) {
            return function() {
                context.pan(d);
            };
        }

        // pan amount
        var pa = 5;

        var keybinding = d3.keybinding('main')
            .on('⌫', function() { d3.event.preventDefault(); })
            .on('←', pan([pa, 0]))
            .on('↑', pan([0, pa]))
            .on('→', pan([-pa, 0]))
            .on('↓', pan([0, -pa]));

        d3.select(document)
            .call(keybinding);

        context.enter(iD.modes.Browse(context));

        context.container()
            .call(iD.ui.Splash(context))
            .call(iD.ui.Restore(context));

        var authenticating = iD.ui.Loading(context)
            .message(t('loading_auth'));

        context.connection()
            .on('authenticating.ui', function() {
                context.container()
                    .call(authenticating);
            })
            .on('authenticated.ui', function() {
                authenticating.close();
            });
    }

    function ui(container) {
        context.container(container);
        context.loadLocale(function() {
            render(container);
        });
    }

    ui.sidebar = iD.ui.Sidebar(context);

    return ui;
};

iD.ui.tooltipHtml = function(text, key) {
    var s = '<span>' + text + '</span>';
    if (key) {
        s += '<div class="keyhint-wrap">' +
            '<span> ' + (t('tooltip_keyhint')) + ' </span>' +
            '<span class="keyhint"> ' + key + '</span></div>';
    }
    return s;
};
