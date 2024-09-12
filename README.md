# Dino_Game_CS455

Demo: https://saketj21.github.io/Dino_Game_CS455/

## CI/CD Pipeline:

The CI/CD pipleline for this project is made using GitHub Actions, Everytime we merge a new branch,
GitHub Actions run all the predescribed tests and metrics and give us a report.

You can Find the Results of Code Quality metrics of each pull request by going to Actions tab of this repository
and checking the lint build, it compromises of all the quality checks that are being performed, click on specific
steps to know more about that test/metric. For Code Duplication metric you can check by running

`npm run duplication`

and the reports are saved to a file name jscpd-report.json in report folder, for other metrics/tests you can directly
check in github actions to find all details
