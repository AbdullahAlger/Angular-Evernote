
var evervoice = angular.module('evervoiceApp', []);

evervoice.config(function($httpProvider) {
   console.log($httpProvider.defaults.headers.post);
});

evervoice.controller('myCtrl', ['$scope', 'voiceRecord', '$http', function($scope, voiceRecord, $http) {

/////////////////// Text Box ////////////////////

    // Listener Pattern
    voiceRecord.setListener(function(value) {
        $scope.$apply(function() {
            $scope.interimTranscript = value;
            console.log('Transcript: ', $scope.interimTranscript);
        });
    });

//////////////////// Dictate Button ////////////////////

    $scope.dictate = function() {
        voiceRecord.startRecognition();

    };

/////////////////// Evernote Button ////////////////////

   $scope.createNote = function() {

       var speech = JSON.stringify({content: $scope.interimTranscript});

    $http({

        method: 'POST',
        url: '/postNote',
        data: speech})
        .success(function(data, status) {
        console.log('success', status);
        console.log(data);})
        .error(function(data, status) {
        console.log('error', status);
        console.log(data);
    });
   };

}]);




evervoice.service('voiceRecord', function() {

    var recognitionListener;

    return {

        setListener: function(listen) {
            recognitionListener = listen;
        },

        startRecognition: function () {

            var recognition = new webkitSpeechRecognition();
            var recognizing = true;
            recognition.lang = ['English', ['en-US', 'United States']];
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onstart = function (e) {
                console.log('Recognizing speech...');
            };

            recognition.onspeechend = function (e) {
                console.log('Speech processed.');
                recognizing = false;
            };

            recognition.onresult = function (e) {
                var interimTranscript = '';
                for (var i = e.resultIndex; i < e.results.length; i++) {
                    interimTranscript = e.results[i][0].transcript;
                    if(recognitionListener)  {
                        recognitionListener(interimTranscript);
                    }
                }
            };
            recognition.start();
        }
    };

});



