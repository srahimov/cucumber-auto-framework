@api @account
Feature: Account API on Automation Exercise
  As an API consumer
  I want to verify account management endpoints
  So that I can ensure they work correctly

  @XRAY-201 @smoke
  Scenario: Verify login with valid credentials via API
    Given I have valid user credentials
    When I send a POST request to verify login
    Then the API response code should be 200
    And the response message should be "User exists!"

  @XRAY-202 @regression
  Scenario: Verify login with invalid credentials via API
    Given I have invalid user credentials
    When I send a POST request to verify login
    Then the API response code should be 404
    And the response message should be "User not found!"
