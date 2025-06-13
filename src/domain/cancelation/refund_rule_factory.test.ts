import { RefundRuleFactory } from "./refund_rule_factory"

describe("RefundRuleFactory", () => {
    it("deve retornar FullRefund quando a reserva for cancelada com mais de 7 dias de antecedência", () => {
        const fullRefund = RefundRuleFactory.getRefundRule(8);
        const result = fullRefund.calculateRefund(100);
        expect(result).toBe(0);
    });
    it("deve retornar PartialRefund quando a reserva for cancelada entre 1 e 7 dias de antecedência", () => {
        const partialRefund = RefundRuleFactory.getRefundRule(5);
        const result = partialRefund.calculateRefund(100);
        expect(result).toBe(50);
    });
    it("deve retornar NoRefund quando a reserva for cancelada com menos de 1 dia de antecedência", () => {
        const noRefund = RefundRuleFactory.getRefundRule(0);
        const result = noRefund.calculateRefund(100)
        expect(result).toBe(100);
    });
})