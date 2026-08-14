module.exports = (output, { vars }) => {
  const getField = (name) => {
    const match = String(output).match(new RegExp('^' + name + '=(.+)$', 'm'));
    return match ? match[1].trim() : '';
  };

  const verdict = getField('VERDICT');
  const classification = getField('CLASSIFICATION');
  const reason = getField('REASON');
  const pass =
    verdict === String(vars.expected_verdict || '').trim() &&
    classification === String(vars.expected_classification || '').trim() &&
    reason.length > 0;

  return {
    pass,
    score: pass ? 1 : 0,
    reason: pass
      ? '评审器正确区分了该固定案例。'
      : '期望 ' + vars.expected_verdict + ' / ' + vars.expected_classification +
        '，实际为 ' + (verdict || '缺少 VERDICT') + ' / ' +
        (classification || '缺少 CLASSIFICATION') + '。原始输出：' + String(output),
  };
};
