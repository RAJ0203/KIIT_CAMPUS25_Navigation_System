"""Navigation contract tests to activate after Riddhiraj's /route API is available.

These tests intentionally do not duplicate Dijkstra or hard-code unverified route
measurements. Replace the placeholder fixture values only with IDs/distances that
Kushagra has marked VERIFIED in the canonical graph.
"""

import pytest

pytestmark = pytest.mark.navigation_contract


@pytest.mark.skip(reason="Awaiting canonical graph + POST /route implementation and verified test fixtures")
def test_same_node():
    pass


@pytest.mark.skip(reason="Awaiting verified canonical edge")
def test_direct_route():
    pass


@pytest.mark.skip(reason="Awaiting verified canonical graph path")
def test_multi_edge_route():
    pass


@pytest.mark.skip(reason="Awaiting canonical graph + undirected-edge verification")
def test_reverse_route():
    pass


@pytest.mark.skip(reason="Awaiting verified A/B/C cross-block connector")
def test_cross_block_route():
    pass


@pytest.mark.skip(reason="Awaiting verified floor topology + staircase connectors")
def test_cross_floor_route():
    pass


@pytest.mark.skip(reason="Awaiting final /route validation behavior")
def test_invalid_source():
    pass


@pytest.mark.skip(reason="Awaiting final /route validation behavior")
def test_invalid_destination():
    pass


@pytest.mark.skip(reason="Requires a deliberately disconnected/verified-unreachable fixture")
def test_unreachable_node():
    pass


@pytest.mark.skip(reason="Awaiting verified staircase node IDs")
def test_staircase_transition_uses_26_units():
    pass


@pytest.mark.skip(reason="Awaiting API representation for optional lift guidance")
def test_lift_guidance_does_not_create_dijkstra_transition():
    pass
