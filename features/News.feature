Feature: News

@News
Scenario: Load News
Given I open the app
Then I click the "Start setup"
Then I click the "First switch"
Then I scroll down the page lightly
Then I scroll up the page quickly
Then I click the "Next step"
Then I wait for 20s until the "New Content" is appears
Then I click the "Yes"
Then I wait for 30s until the "AMT-Home" is appears
Then I click the "AMT-News-RSS"
Then I wait for 10s until the "May 10" is appears
Then I scroll down to the "School Financial Plan" within 20s
Then I scroll up to the "May 10" within 20s
# Then I wait for 10s until the "TBD" is appears
Then I wait for 5s