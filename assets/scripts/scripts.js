var app = angular.module('quizApp', ['ngMaterial', 'ngAnimate']);

app.directive('quiz', function(quizFactory, $http) {
	return {
		restrict: 'AE',
		scope: {},
		templateUrl: '../html/quiz.html',
		link: function(scope, elem, attrs) {
			scope.lang = quizFactory.getLanguage();

            scope.start = function() {
				scope.id = 0;
				scope.quizOver = false;
				scope.inProgress = true;
				scope.getQuestion();
			};

			scope.reset = function() {
				scope.inProgress = false;
				scope.score = 0;
			}

			scope.getQuestion = function() {
				let q = quizFactory.getQuestion(scope.id);
				if(q) {
					scope.name = q.name;
					scope.group = q.group;
					scope.subgroup = q.subgroup;
					scope.image = q.image;
					scope.question = q.question;
					scope.options = q.options;
					scope.answer = q.answer;
					if (q.answer.length > 1) {
					    scope.fieldType = 'checkbox';
					    scope.optionModel = {};
					} else {
					    scope.fieldType = 'radio';
					    scope.optionModel = '';
					}
					scope.answerMode = true;
				} else {
					scope.quizOver = true;
				}
			};

			scope.checkAnswer = function(answer) {
				scope.correctAns = false;
				if(!answer) return;

                if (typeof answer !== 'string') { // multiple answers
                    scope.answers = [];
                    for(let key in answer){
                        if (answer.hasOwnProperty(key) && (answer[key] === true)){
                            scope.answers.push(key*1);
                        }
                    }

                    // compare if scope.answers and scope.answer are identical
                    if (JSON.stringify(scope.answers) === JSON.stringify(scope.answer)) {
                        scope.correctAns = true;
                    }
                }
                if (answer == scope.options[scope.answer]) {
                    scope.correctAns = true;
                }

                if (scope.correctAns) {
                    scope.score++;
                }
                scope.answerMode = false;
			};

			scope.nextQuestion = function() {
				scope.id++;
				scope.getQuestion();
			}

			scope.reset();

		}
	}
});

app.factory('quizFactory', function($http) {

	let questions = [];
    let language = {};

    $http.get('../json/quizQuestions.json').then(function(response){
        for(let key in response.data.questions){
            if ((response.data.questions).hasOwnProperty(key)) {
            questions.push(response.data.questions[key]);
            }
        }
        language = response.data.language;
    });

	return {
		getQuestion: function(id) {
			if(id < questions.length) {
				return questions[id];
			} else {
				return false;
			}
		},
		getLanguage: function() {
		    return language;
		}
	};
});