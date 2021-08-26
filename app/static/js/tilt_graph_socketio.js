Highcharts.setOptions({
  time: {
      useUTC: false
  }
});

var TickAmountValue = 7;

Highcharts.chart(graph_data.chart_id, {
  chart: {
    events: {
      load: function () {
        var self = this
        var event_name = 'tilt_session_update|' + graph_data.chart_id
        socket.on(event_name, function (event)
        {
          var data = JSON.parse(event);
          if (data['rssi']) {
            self.setTitle(graph_data.title, {text: 'RSSI: ' + data['rssi'] + 'dBm'});
          } else {
            self.setTitle(graph_data.title);
          }
          for (point of data['data']) {
            self.series[0].addPoint([point.time, point.temp]);
            self.series[1].addPoint([point.time, point.gravity]);  
          }
        });
      },
    },

    type: 'spline',
    zoomType: 'xy'
  },

  credits: {
    enabled: false
  },

  colors: ['#F93', '#9F3', '#06C', '#036', '#000'],

  plotOptions: {
    spline: {
      marker: {
        enabled: true
      }
    }
  },

  title: graph_data.title,

  subtitle: graph_data.subtitle,

  xAxis: {
    type: 'datetime',
    dateTimeLabelFormats: {
      day: '%b %e'
    },
    title: {
      text: 'Time'
    },
  },

  yAxis: [
    {
      title: {
        text: 'Temperature (F)'
      },
	  tickPositioner: function () {
        var positions = [],
        tick = Math.floor(this.dataMin),
        increment = Math.ceil((this.dataMax - this.dataMin) / 6);

        if (this.dataMax !== null && this.dataMin !== null) {
          for (tick; tick - increment <= this.dataMax; tick += increment) {
            positions.push(tick);
          }
        }
		TickAmountValue = positions.length;
        return positions;
	  },
    }, {
      title: {
        text: 'Specific Gravity'
      },
	  tickAmount: TickAmountValue,
	  tickInterval: 0.01,
      opposite: true
  }],
  
  series: graph_data.series,
});
