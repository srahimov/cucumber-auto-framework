@api @products-api
Feature: Products API on Automation Exercise
  As an API consumer
  I want to retrieve and search products via API
  So that I can verify the product data is correct

  @XRAY-203 @smoke
  Scenario: Get all products list via API
    When I send a GET request to the products list endpoint
    Then the API response code should be 200
    And the response should contain a list of products
    And each product should have a name and price

  @XRAY-204 @regression
  Scenario: Search for a product via API
    When I send a POST request to search for product "top"
    Then the API response code should be 200
    And the search results should not be empty
