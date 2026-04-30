@ui @products
Feature: Product Search on Automation Exercise
  As a shopper
  I want to search for products
  So that I can find items I want to purchase

  Background:
    Given I am on the products page

  @EXG-3 @smoke
  Scenario: Products page loads with all products visible
    Then the products page should be loaded
    And I should see at least one product listed

  @EXG-4 @regression
  Scenario: Search for a product by keyword
    When I search for the product "Tops"
    Then I should see the search results heading
    And the search results should contain products
