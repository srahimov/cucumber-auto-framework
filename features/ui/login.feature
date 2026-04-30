@ui @login
Feature: User Login on Automation Exercise
  As a registered user
  I want to log in to the website
  So that I can access my account and place orders

  Background:
    Given I am on the login page

  @EXG-1 @smoke
  Scenario: Successful login with valid credentials
    When I enter valid email and password
    And I click the login button
    Then I should be logged in successfully
    And I should see my username in the header

  @EXG-2 @regression
  Scenario: Failed login with invalid credentials
    When I enter email "invalid@test.com" and password "wrongpass"
    And I click the login button
    Then I should see an error message "Your email or password is incorrect!"
