ymaps.ready(function init() {
    var map = new ymaps.Map('map',
        {
            center: [53.707303,91.696818],
            zoom: 10,
            minZoom: 3,
            behaviors: ['default', 'scrollZoom']
        }),
        mapCursor,
        trafficPolygon = new ymaps.Polygon(([trafficBorder]), {}, {
            editorDrawingCursor: "crosshair",
            editorMaxPoints: 1000,
            fill: false,
            strokeColor: '#00ff00',
            strokeWidth: 2
        }),
        trafficGeometry = trafficPolygon.geometry,
        lastRoute = undefined,
        searchTarget = false,
        srcPlacemark = undefined,
        dstPlacemark = undefined;

    var trafficControl = new ymaps.control.TrafficControl(
        {
            providerKey: 'traffic#actual',
            shown: false
        });

    map.controls
        .add(trafficControl, {left: 100, top: 5})
        .add('typeSelector', {right: 5, top: 5})
        .add('zoomControl', {left: 5, top: 40})
        .add('mapTools', {left: 35, top: 5});

    map.geoObjects.add(trafficPolygon);
    map.setBounds(trafficPolygon.geometry.getBounds());

    map.events.add('click', function (e) {
        var coords = e.get('coordPosition'), placemark;

        switch (searchTarget) {
            case 'src':
                $('#srcAddress').val(coords[0].toFixed(6) + ',' + coords[1].toFixed(6));

                if (!srcPlacemark) {
                    srcPlacemark = new ymaps.Placemark([0, 0],
                        {
                            iconContent: '1'
                        },
                        {
                            preset: 'twirl#blueIcon'
                        });
                }
                placemark = srcPlacemark;
                break;
            case 'dst':
                $('#dstAddress').val(coords[0].toFixed(6) + ',' + coords[1].toFixed(6));
                if (!dstPlacemark) {
                    dstPlacemark = new ymaps.Placemark([0, 0],
                        {
                            iconContent: '2'
                        },
                        {
                            preset: 'twirl#blueIcon'
                        });
                }
                placemark = dstPlacemark;
                break;
        }

        placemark.geometry.setCoordinates(coords);
        map.geoObjects.add(placemark);

        $('#map').removeClass('active');
        $('#srcButton, #dstButton').removeClass('ui-state-active');
        $('#calcButton').click();
    });

    $('#srcAddress, #dstAddress').suggestAddress()
        .keypress(function (e) {
            if (e.which == 13) {
                $('#calcButton').click();
            }
        }).focus(function () {
            searchTarget = false;
            if (mapCursor) {
                mapCursor.remove();
                mapCursor = undefined;
            }
            $('#map').removeClass('active');
            $('#srcButton, #dstButton').removeClass('ui-state-active');
        });

    $('#srcButton').click(function (e) {
        mapCursor = mapCursor || map.cursors.push('arrow');
        $('#map').addClass('active');
        $('#srcButton').addClass('ui-state-active');
        $('#dstButton').removeClass('ui-state-active');
        searchTarget = 'src';
    });

    $('#dstButton').click(function (e) {
        mapCursor = mapCursor || map.cursors.push('arrow');
        $('#map').addClass('active');
        $('#dstButton').addClass('ui-state-active');
        $('#srcButton').removeClass('ui-state-active');
        searchTarget = 'dst';
    });

    $('#calcButton').click(function () {
        var from = $.trim($('#srcAddress').val()),
            to = $.trim($('#dstAddress').val());
        $('#calcResults').hide();
        $('#resultDetailsTime').hide();
        $('#resultDetailsKm').hide();

        searchTarget = false;
        if (mapCursor) {
            mapCursor.remove();
            mapCursor = undefined;
        }

        if (lastRoute)    {
            map.geoObjects.remove(lastRoute);
        }

        $.calcroute.totals(
            [from, to],
            trafficGeometry,
            $('#vehicleWeight').val(),
            $('#nightlyRate').is(':checked')
        ).done(function (route, routeTotals) {
            var path = route.getPaths().get(0);

            lastRoute = route;

            if (srcPlacemark) {
                map.geoObjects.remove(srcPlacemark);
            }
            if (dstPlacemark) {
                map.geoObjects.remove(dstPlacemark);
            }

            $('#map').removeClass('active');
            $('#srcButton, #dstButton').removeClass('ui-state-active');

            map.geoObjects.add(route);

            if (path && path.geometry) {
                map.setBounds(path.geometry.getBounds());
            }
            console.dir('routeTotals: ' + routeTotals);
            $.calcroute.showCalcResult(routeTotals);
        });
    });
    //BIND OFFER SUBMIT HANDLER
    $('#offerForm').submit(function(){
        var offerForm = $('#offerForm');
        offerForm.find('#from').val($('#srcAddress').val());
        offerForm.find('#to').val($('#dstAddress').val());
        offerForm.find('#weight').val($('#vehicleWeight option:selected').text());
    });
});
