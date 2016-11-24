/**
 * Created by G on 23-10-2016.
 */
Array.prototype.sum = Array.prototype.sum || function () {
      return this.reduce(function (sum, a) {
         return sum + Number(a)
      }, 0);
   }

Array.prototype.average = Array.prototype.average || function () {
      return this.sum() / (this.length || 1);
   }

var ws = new WebSocket('ws://20.0.0.112:3030');
var currentValues = {
   'potentiometer': {raw: null, avg: [0, 0, 0, 0, 0], avgValue: 0},
   'motorPower': {raw: null, avg: [0, 0, 0, 0, 0], avgValue: 0},
   'motorFeedback': {raw: null, avg: [0, 0, 0, 0, 0], avgValue: 0},
   'emf': {raw: null, avg: [0, 0, 0, 0, 0], avgValue: 0}
};

ws.onopen = function () {
   $('#websocket_conn_status_field_id').text('Connected');
   $('#websocket_conn_status_field_id').css('color', 'green');
   $('#websocket_status_led_id').css('background-color', 'greenyellow');
};

ws.onclose = function () {
   $('#websocket_conn_status_field_id').text('Disconnected');
   $('#websocket_conn_status_field_id').css('color', 'red');
   $('#websocket_status_led_id').css('background-color', 'red');
};

ws.onmessage = function (payload) {
   var data = '';
   try {
      data = JSON.parse(payload.data);
   } catch (e) {
      data = payload.data;
   }
   // console.log(typeof data);
   if (typeof data === 'object') {
      updateStatus(data);
      // updateGraph(data);
   } else {
      console.log('control.js::ws.onmessage: ' + data);
   }
};

$(function () {
   console.log('Control loaded');

   $('#update_status_btn_id').on('click', function (e) {
      $.getJSON('api', updateStatus);
   });

   $('#update_item_5_value_btn_id').on('click', function (e) {
      var item_id = this.id.split('_')[2];
      var item_value = $('#item_input_field_id').val();

      if (item_value) {
         $.getJSON('api/' + item_id + '/' + item_value, updateItemValue);
      } else {
         alert('The new value can\'t be empty!!');
      }
   });

   $('#ws_close_btn_id').on('click', function (e) {
      ws.send('exit');
   });

   $('#start_chopper_btn_id').on('click', function (e) {
      $.post('api', {
         command: 'start motor',
         value: 150
      }, updateCommandFeedback);
   });

   $('#set_chopper_btn_id').on('click', function (e) {
      $.post('api', {
         command: 'set motor',
         value: $('#set_chopper_value_input_field_id').val()
      }, updateCommandFeedback);
   });

   $('#stop_chopper_btn_id').on('click', function (e) {
      $.post('api', {
         command: 'stop motor',
         value: 150
      }, updateCommandFeedback);
   });

   $('#test_chopper_btn_id').on('click', function (e) {
      $.post('api', {
         command: 'test motor',
         value: 100
      }, updateCommandFeedback);
   });

   // $.getJSON('api', updateStatus);

});

function updateCommandFeedback(data) {
   console.log({location: 'control.js::updateCommandFeedback (data): ', msg: data});
   $('#command_feedback_field_id').text(data.msg);
}

function updateStatus(data) {

   if (data.item) {
      currentValues[data.item].raw = data;
      $('#' + data.item + '_value_status_cell_id').text(data.value);
      $('#' + data.item + '_data_status_cell_id').text(data.data);
      $('#' + data.item + '_updated_status_cell_id').text(data.time);

      switch (data.item) {
         case 'potentiometer':
            currentValues[data.item].avg.push(data.value);
            currentValues[data.item].avg.shift();
            currentValues[data.item].avgValue = currentValues[data.item].avg.average();
            break;

         default:
            currentValues[data.item].avg.push(data.data);
            currentValues[data.item].avg.shift();
            currentValues[data.item].avgValue = currentValues[data.item].avg.average();
            break;
      }
   }

   console.log(currentValues);
   // var motorV = parseInt(currentValues['motorFeedback'].data),
   //    pwmV = parseInt(currentValues['motorPower'].data) - motorV;
   //
   // var emf = (motorV - (pwmV * 16)) / 4;
   // console.log({
   //    location: 'control.js::updateStatus (emf): ',
   //    emf: emf,
   //    pwmV: (pwmV * (5 / 1024)),
   //    motorV: motorV
   // });
   // currentValues['emf'].data = emf;
}

function updateItemValue(data) {
   console.log('control.js::updateItemValue (data): ' + data);
   $('#item_5_current_value_field_id').text(data.value);
   $('#item_5_updated_field_id').text(data.time);
}