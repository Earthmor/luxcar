jQuery.extend({
    calcroute: {
        totals: function (fromTo, cityGeometry, vehicleWeight, isNightlyRate) {
            var $this = this,
                dretval = $.Deferred(),
                droute = new $.Deferred(),
                dfrom = new $.Deferred(),
                dto = new $.Deferred(),
                cityCenter = '59.941, 30.331';
            retval = {
                totalDistance: 0,
                extraKmDistance: 0,
                price: 0,

                givingFee: 0,
                regionGivingFee: 0,
                overtimeFee: 0,
                kmFee: 0,

                overtime: 0,
                overtimeCnt: 0,

                overtimePrice: 0,
                nightlyFee: 0
            };
            nightlyFee = 500;
            overtimeFee = 400;
            rates = [
                [1400, 35],
                [1300, 40],
                [1400, 45],
                [1500, 50],
                [1800, 55]
            ];
            regionGivingFee = [200, 300, 500, 1000];
            rate = rates[vehicleWeight];

            ymaps.route(fromTo).then(function (route) {
                droute.resolve(route);
            });
            ymaps.route([fromTo[0], cityCenter]).then(function (routeSrcToCenter) {
                dfrom.resolve(routeSrcToCenter);
            });
            ymaps.route([fromTo[1], cityCenter]).then(function (routeDstToCenter) {
                dto.resolve(routeDstToCenter);
            });

            $.when(droute, dfrom, dto).done(function (route, routeSrcToCenter, routeDstToCenter) {
                var routeDistances = $this.calcDistances(route, cityGeometry, true),
                    srcToCenterDistances = $this.calcDistances(routeSrcToCenter, cityGeometry),
                    dstToCenterDistances = $this.calcDistances(routeDstToCenter, cityGeometry),
                    path = route.getPaths().get(0),
                    maxRegionDistance = Math.max(srcToCenterDistances.regionDistance, dstToCenterDistances.regionDistance);

                retval.time = route.getTime() / 60;
                retval.humanTime = route.getHumanTime();
                retval.routeLength = route.getLength() / 1000;
                retval.distanceFromCity = maxRegionDistance;

                retval.givingFee = rate[0];

                if (maxRegionDistance > 100) {
                    retval.regionGivingFee = regionGivingFee[3];
                } else if (maxRegionDistance > 50)    {
                    retval.regionGivingFee = regionGivingFee[2];
                } else if (maxRegionDistance > 20)    {
                    retval.regionGivingFee = regionGivingFee[1];
                } else if (maxRegionDistance > 0)        {
                    retval.regionGivingFee = regionGivingFee[0];
                }

                if (routeDistances.regionDistance > 20) {
                    retval.extraKmDistance = (routeDistances.regionDistance - 20);
                    retval.kmFee = rate[1];
                }

                if (isNightlyRate) {
                    retval.nightlyFee = nightlyFee;
                }

                retval.price = retval.givingFee + retval.regionGivingFee + retval.nightlyFee + retval.extraKmDistance * retval.kmFee;
                dretval.resolve(route, retval);
            });

            return dretval.promise();
        },

        calcDistances: function (route, cityGeometry, kkk) {
            var path = route.getPaths().get(0),
                segments = path ? path.getSegments() : [],
                retval = {
                    fromCity: false,
                    cityDistance: 0,
                    regionDistance: 0
                };

            if (!path) return false;

            for (var s = 0, segmentCount = segments.length; s < segmentCount; s++) {
                var segment = segments[s],
                    coords = segment.getCoordinates();

                if (s == 0 && cityGeometry.contains(coords[0])) {
                    retval.fromCity = true;
                }
                if (kkk && segment.getStreet() == 'КАД') {
                    retval.cityDistance += segment.getLength();		// segment is inside KAD
                } else if (cityGeometry.contains(coords[0]) && cityGeometry.contains(coords[coords.length - 1])) {
                    retval.cityDistance += segment.getLength();		// segment is inside KAD
                } else if (!cityGeometry.contains(coords[0]) && !cityGeometry.contains(coords[coords.length - 1])) {
                    retval.regionDistance += segment.getLength();	// segment is outside KAD
                } else {
                    var tmpRegionLength = 0;
                    if (cityGeometry.contains(coords[0])) {			// segment is partially inside/outside KAD
                        coords = coords.reverse();
                    }
                    for (var c = 0, coordCount = coords.length; c < coordCount; c++) {
                        if (c > 0) {
                            tmpRegionLength += ymaps.coordSystem.geo.getDistance(coords[c - 1], coords[c]);
                        }
                        if (cityGeometry.contains(coords[c])) {
                            retval.regionDistance += tmpRegionLength;
                            retval.cityDistance += segment.getLength() - tmpRegionLength;
                            break;
                        }
                    }
                }
            }

            retval.cityDistance /= 1000;
            retval.regionDistance /= 1000;

            return retval;
        }
    }
});